import { inject, Injectable } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { Auth, user, signInWithEmailAndPassword, signOut, User } from "@angular/fire/auth";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth = inject(Auth);

    user = toSignal(user(this.auth));


    async login(email:string, password: string){
        return signInWithEmailAndPassword(this.auth, email, password);
    }

    async logout(){
        return signOut(this.auth);
    }
}