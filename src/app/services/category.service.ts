import { inject, Injectable } from "@angular/core";
import {
  Firestore,
  collection,
  collectionData,
  serverTimestamp,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "@angular/fire/firestore";
import { Observable, of, switchMap } from "rxjs";
import { Category } from "../model/category";
import { AuthService } from "./auth.service";

export type CategoryWritePayload = Omit<Category, "id" | "userId">;

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  private readonly firebase = inject(Firestore);
  private readonly auth = inject(AuthService);
  private readonly categoryCollectionRef = collection(this.firebase, "category");

  getCategories$(): Observable<Category[]> {
    return this.auth.authenticatedUid$.pipe(
      switchMap((uid) => {
        if (!uid) {
          return of([] as Category[]);
        }
        const qRef = query(this.categoryCollectionRef, where("userId", "==", uid));
        return collectionData(qRef, { idField: "id" }) as Observable<Category[]>;
      })
    );
  }

  getAllCategories$(): Observable<Category[]> {
    const ref = query(this.categoryCollectionRef);
    return collectionData(ref, { idField: "id" }) as Observable<Category[]>;
  }

  async createCategory(payload: CategoryWritePayload): Promise<void> {
    const userId = await this.auth.requireUidForWrites();
    await addDoc(this.categoryCollectionRef, {
      ...this.normalizeCategoryPayload(payload),
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async updateCategory(id: string, payload: CategoryWritePayload): Promise<void> {
    await this.auth.requireUidForWrites();
    const ref = doc(this.firebase, "category", id);
    await updateDoc(ref, {
      ...this.normalizeCategoryPayload(payload),
      updatedAt: serverTimestamp(),
    });
  }

  async deleteCategory(id: string): Promise<void> {
    await this.auth.requireUidForWrites();
    const ref = doc(this.firebase, "category", id);
    await deleteDoc(ref);
  }

  private normalizeCategoryPayload(p: CategoryWritePayload): CategoryWritePayload {
    return {
      name: p.name.trim(),
      description: p.description.trim(),
    };
  }
}
