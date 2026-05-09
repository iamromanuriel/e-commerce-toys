import { Inject, inject, signal, computed, Injectable } from "@angular/core";
import { Firestore, collection, collectionData } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";
import { Category } from "../model/category";

@Injectable(
    { providedIn: 'root'}
)
export class CategoryService {
    private firebase = inject(Firestore);
    private categoryCollection = collection(this.firebase, 'category');

    getCategories$(): Observable<Category[]> {
        return collectionData(this.categoryCollection, { idField: 'id' }) as Observable<Category[]>;
    }
}