import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  serverTimestamp,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Product } from '../../model/produt';

export type ProductWritePayload = Omit<Product, 'id'>;

@Injectable()
export class AdminProductService {
  private readonly firestore = inject(Firestore);
  private readonly productsCol = collection(this.firestore, 'products');

  readonly products$: Observable<Product[]> = collectionData(this.productsCol, {
    idField: 'id',
  }) as Observable<Product[]>;

  async createProduct(payload: ProductWritePayload): Promise<void> {
    await addDoc(this.productsCol, {
      ...this.normalizePayload(payload),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async updateProduct(id: string, payload: ProductWritePayload): Promise<void> {
    const ref = doc(this.firestore, 'products', id);
    await updateDoc(ref, {
      ...this.normalizePayload(payload),
      updatedAt: serverTimestamp(),
    });
  }

  async deleteProduct(id: string): Promise<void> {
    const ref = doc(this.firestore, 'products', id);
    await deleteDoc(ref);
  }

  private normalizePayload(p: ProductWritePayload): ProductWritePayload {
    return {
      brand: p.brand.trim(),
      model: p.model.trim(),
      description: p.description.trim(),
      categoryId: p.categoryId.trim().toLowerCase(),
      imageUrl: p.imageUrl.trim(),
      price: Number(p.price),
      stock: Math.floor(Number(p.stock)),
    };
  }
}
