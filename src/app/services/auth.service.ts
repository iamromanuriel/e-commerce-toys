import { Injectable, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  Auth,
  user,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  User,
} from "@angular/fire/auth";
import {
  Observable,
  distinctUntilChanged,
  firstValueFrom,
  map,
  shareReplay,
  take,
  tap,
} from "rxjs";

const LS_UID_KEY = "firebase_uid";
const LS_TOKEN_KEY = "firebase_id_token";

function readLocalStorageUid(): string | null {
  if (
    typeof globalThis === "undefined" ||
    typeof globalThis.localStorage === "undefined"
  ) {
    return null;
  }
  return globalThis.localStorage.getItem(LS_UID_KEY);
}

function persistSessionCredentials(userCred: User | null): void {
  if (
    typeof globalThis === "undefined" ||
    typeof globalThis.localStorage === "undefined"
  ) {
    return;
  }
  const storage = globalThis.localStorage as Storage;
  if (!userCred) {
    storage.removeItem(LS_UID_KEY);
    storage.removeItem(LS_TOKEN_KEY);
    return;
  }
  storage.setItem(LS_UID_KEY, userCred.uid);
  void userCred
    .getIdToken()
    .then((token) => storage.setItem(LS_TOKEN_KEY, token))
    .catch(() => {
      storage.removeItem(LS_TOKEN_KEY);
    });
}

function clearStoredSession(): void {
  if (
    typeof globalThis === "undefined" ||
    typeof globalThis.localStorage === "undefined"
  ) {
    return;
  }
  globalThis.localStorage.removeItem(LS_UID_KEY);
  globalThis.localStorage.removeItem(LS_TOKEN_KEY);
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly auth = inject(Auth);

  /** Estado del usuario desde Firebase synchronizado al localStorage. */
  readonly currentUser$ = user(this.auth).pipe(
    tap((u) => persistSessionCredentials(u)),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  readonly currentUserSignal = toSignal(this.currentUser$, { initialValue: null });

  /**
   * UID para consultas tenant-scoped (Firebase tiene prioridad; si tarde la hidratación,
   * puede usarse el uid cacheado en localStorage hasta que llegue la sesión).
   */
  readonly authenticatedUid$: Observable<string | null> = this.currentUser$.pipe(
    map((u) => u?.uid ?? readLocalStorageUid()),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /** Limpia la sesión local y cierra Firebase Auth. */
  async logout(): Promise<void> {
    clearStoredSession();
    await signOut(this.auth);
  }

  /** Resuelve si hay sesión Firebase o uid cacheado para el guard. */
  async isAuthenticatedSnapshot(): Promise<boolean> {
    await firstValueFrom(this.currentUser$.pipe(take(1)));
    const hasFirebaseUser = !!this.auth.currentUser;
    const storedUid = readLocalStorageUid();
    return hasFirebaseUser || !!storedUid;
  }

  /**
   * UID del usuario para crear documentos tenant-scoped; prioriza Firebase Auth
   * y permite fallback solo si existe uid válido guardado tras un login previo.
   */
  async requireUidForWrites(): Promise<string> {
    await firstValueFrom(this.currentUser$.pipe(take(1)));
    const firebaseUid = this.auth.currentUser?.uid;
    if (firebaseUid) {
      return firebaseUid;
    }
    const fallback = readLocalStorageUid();
    if (fallback) {
      return fallback;
    }
    throw new Error("No hay usuario autenticado");
  }
}
