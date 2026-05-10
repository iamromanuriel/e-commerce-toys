import { Inject, inject, signal, computed, Injectable } from "@angular/core";
import { Firestore, collection, collectionData, addDoc, serverTimestamp } from "@angular/fire/firestore";
import { Observable, from } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";
import { Product } from "../model/produt";
import { writeBatch, doc } from "firebase/firestore";

const ITEMS_PER_PAGE = 12;

@Injectable(
    { providedIn: 'root'}
)
export class ProductService {
    private firebase = inject(Firestore);
    private productCollection = collection(this.firebase, 'products');
    private currentPage = signal(1);

    
    private product: Product[] = [
  {
    "brand": "FAMOSA",
    "model": "ABRE EL CUARTO SECRETO PINOCCHIO AND FRIENDS",
    "price": 250.00,
    "stock": 0,
    "imageUrl": "",
    "description": "ABRE EL CUARTO SECRETO PINOCCHIO AND FRIENDS",
    "categoryId": "default"
  },
  {
    "brand": "HASBRO",
    "model": "MINI CORTES DIVERTIDOS PLAY DOH",
    "price": 100.00,
    "stock": 24,
    "imageUrl": "",
    "description": "MINI CORTES DIVERTIDOS PLAY DOH",
    "categoryId": "default"
  },
  {
    "brand": "HASBRO",
    "model": "MINI DENTISTA BROMISTA PLAYDOH",
    "price": 100.00,
    "stock": 24,
    "imageUrl": "",
    "description": "MINI DENTISTA BROMISTA PLAYDOH",
    "categoryId": "default"
  },
  {
    "brand": "HASBRO",
    "model": "KIT INICIAL FABRICA DIVERTIDA PLAYDOH",
    "price": 100.00,
    "stock": 4,
    "imageUrl": "",
    "description": "KIT INICIAL FABRICA DIVERTIDA PLAYDOH",
    "categoryId": "default"
  },
  {
    "brand": "HASBRO",
    "model": "MINI HELADERIA PLAYDOH",
    "price": 100.00,
    "stock": 24,
    "imageUrl": "",
    "description": "MINI HELADERIA PLAYDOH",
    "categoryId": "default"
  },
  {
    "brand": "HASBRO",
    "model": "TACOS DIVERTIDOS PLAY DOH",
    "price": 100.00,
    "stock": 24,
    "imageUrl": "",
    "description": "TACOS DIVERTIDOS PLAY DOH",
    "categoryId": "default"
  },
  {
    "brand": "HASBRO",
    "model": "DELICIAS HELADAS PLAYDOH",
    "price": 100.00,
    "stock": 3,
    "imageUrl": "",
    "description": "DELICIAS HELADAS PLAYDOH",
    "categoryId": "default"
  },
  {
    "brand": "HASBRO",
    "model": "PRIMERAS CREACIONES CON LA RANA Y LOS COLORES PLAYDOH",
    "price": 100.00,
    "stock": 4,
    "imageUrl": "",
    "description": "PRIMERAS CREACIONES CON LA RANA Y LOS COLORES PLAYDOH",
    "categoryId": "default"
  },
  {
    "brand": "HASBRO",
    "model": "DINOSAURIO FORMAS Y COLORES PLAYDOH",
    "price": 100.00,
    "stock": 3,
    "imageUrl": "",
    "description": "DINOSAURIO FORMAS Y COLORES PLAYDOH",
    "categoryId": "default"
  },
  {
    "brand": "HASBRO",
    "model": "MI JARDIN PLAYDOH",
    "price": 200.00,
    "stock": 3,
    "imageUrl": "",
    "description": "MI JARDIN PLAYDOH",
    "categoryId": "default"
  }
]

    getProducts$(): Observable<Product[]> {
        return collectionData(this.productCollection, { idField: 'id' }) as Observable<Product[]>;
    }

    async guardarProductosEnFirebase(): Promise<void> {
        const batch = writeBatch(this.firebase);
        
        this.product.forEach((producto) => {
            const docRef = doc(this.productCollection);
            batch.set(docRef, {
                ...producto,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        });
        
        await batch.commit();
        console.log(`${this.product.length} productos guardados`);
    }

    getCurrentPage(): number {
        return this.currentPage();
    }

    setCurrentPage(page: number): void {
        this.currentPage.set(page);
    }

    getPaginatedProducts(products: Product[]): Product[] {
        const start = (this.currentPage() - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return products.slice(start, end);
    }

    getTotalPages(totalProducts: number): number {
        return Math.ceil(totalProducts / ITEMS_PER_PAGE);
    }

    getItemsPerPage(): number {
        return ITEMS_PER_PAGE;
    }
}
