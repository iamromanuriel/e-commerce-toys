import { Inject, inject, signal, Injectable } from "@angular/core";
import { Firestore, collection, collectionData, serverTimestamp } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { Product } from "../model/produt";
import { Category } from "../model/category";
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
    "imageUrl": "https://http2.mlstatic.com/D_NQ_NP_2X_914123-MLU74771503063_022024-F.webp",
    "description": "ABRE EL CUARTO SECRETO PINOCCHIO AND FRIENDS",
    "categoryId": "famosa"
  },
  {
    "brand": "HASBRO",
    "model": "MINI CORTES DIVERTIDOS PLAY DOH",
    "price": 100.00,
    "stock": 24,
    "imageUrl": "https://m.media-amazon.com/images/I/71zTzE-ZSaL._AC_SL1500_.jpg",
    "description": "MINI CORTES DIVERTIDOS PLAY DOH",
    "categoryId": "hasbro"
  },
  {
    "brand": "HASBRO",
    "model": "MINI DENTISTA BROMISTA PLAYDOH",
    "price": 100.00,
    "stock": 24,
    "imageUrl": "https://m.media-amazon.com/images/I/81TZq-2PpXL._AC_SL1500_.jpg",
    "description": "MINI DENTISTA BROMISTA PLAYDOH",
    "categoryId": "hasbro"
  },
  {
    "brand": "HASBRO",
    "model": "KIT INICIAL FABRICA DIVERTIDA PLAYDOH",
    "price": 100.00,
    "stock": 4,
    "imageUrl": "https://m.media-amazon.com/images/I/81v0ROwDDrL._AC_SL1500_.jpg",
    "description": "KIT INICIAL FABRICA DIVERTIDA PLAYDOH",
    "categoryId": "hasbro"
  },
  {
    "brand": "HASBRO",
    "model": "MINI HELADERIA PLAYDOH",
    "price": 100.00,
    "stock": 24,
    "imageUrl": "https://m.media-amazon.com/images/I/814wyH9kKgL._AC_SL1500_.jpg",
    "description": "MINI HELADERIA PLAYDOH",
    "categoryId": "hasbro"
  },
  {
    "brand": "HASBRO",
    "model": "TACOS DIVERTIDOS PLAY DOH",
    "price": 100.00,
    "stock": 24,
    "imageUrl": "https://m.media-amazon.com/images/I/81UK7spLqWL._AC_SL1500_.jpg",
    "description": "TACOS DIVERTIDOS PLAY DOH",
    "categoryId": "hasbro"
  },
  {
    "brand": "HASBRO",
    "model": "DELICIAS HELADAS PLAYDOH",
    "price": 100.00,
    "stock": 3,
    "imageUrl": "https://m.media-amazon.com/images/I/81-HfR2xW3L._AC_SL1500_.jpg",
    "description": "DELICIAS HELADAS PLAYDOH",
    "categoryId": "hasbro"
  },
  {
    "brand": "HASBRO",
    "model": "PRIMERAS CREACIONES CON LA RANA Y LOS COLORES PLAYDOH",
    "price": 100.00,
    "stock": 4,
    "imageUrl": "https://m.media-amazon.com/images/I/81cJ9+2ZQEL._AC_SL1500_.jpg",
    "description": "PRIMERAS CREACIONES CON LA RANA Y LOS COLORES PLAYDOH",
    "categoryId": "hasbro"
  },
  {
    "brand": "HASBRO",
    "model": "DINOSAURIO FORMAS Y COLORES PLAYDOH",
    "price": 100.00,
    "stock": 3,
    "imageUrl": "https://m.media-amazon.com/images/I/81HRVtT5VtL._AC_SL1500_.jpg",
    "description": "DINOSAURIO FORMAS Y COLORES PLAYDOH",
    "categoryId": "hasbro"
  },
  {
    "brand": "HASBRO",
    "model": "MI JARDIN PLAYDOH",
    "price": 200.00,
    "stock": 3,
    "imageUrl": "https://m.media-amazon.com/images/I/81LdR8dP+aL._AC_SL1500_.jpg",
    "description": "MI JARDIN PLAYDOH",
    "categoryId": "hasbro"
  }
];

    getProducts$(): Observable<Product[]> {
        return collectionData(this.productCollection, { idField: 'id' }) as Observable<Product[]>;
    }

    async guardarProductosEnFirebase(): Promise<void> {
        const batch = writeBatch(this.firebase);
        const categoryMap = new Map<string, Category>();

        this.product.forEach((producto) => {
            const productDocRef = doc(this.productCollection);
            batch.set(productDocRef, {
                ...producto,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            const categoryId = producto.categoryId?.trim().toLowerCase() || producto.brand.trim().toLowerCase();
            if (!categoryMap.has(categoryId)) {
                categoryMap.set(categoryId, {
                    id: categoryId,
                    name: producto.brand,
                    description: `Productos de ${producto.brand}`
                });
            }
        });

        categoryMap.forEach((category) => {
            const categoryDocRef = doc(this.firebase, 'category', category.id);
            batch.set(categoryDocRef, {
                ...category,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        });

        await batch.commit();
        console.log(`${this.product.length} productos y ${categoryMap.size} categorías guardados`);
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
