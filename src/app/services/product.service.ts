import { Inject, inject, signal, computed, Injectable } from "@angular/core";
import { Firestore, collection, collectionData, addDoc, serverTimestamp } from "@angular/fire/firestore";
import { Observable, from } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";
import { Product } from "../model/produt";

@Injectable(
    { providedIn: 'root'}
)
export class ProductService {
    private firebase = inject(Firestore);
    private productCollection = collection(this.firebase, 'products');

    getProducts$(): Observable<Product[]> {
        return collectionData(this.productCollection, { idField: 'id' }) as Observable<Product[]>;
    }
}