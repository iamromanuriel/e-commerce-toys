import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../model/produt';
import { ProductService, ProductWritePayload } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../model/category';

@Injectable()
export class AdminProductService {
  private readonly products = inject(ProductService);
  private readonly categoryS = inject(CategoryService);

  readonly products$: Observable<Product[]> = this.products.getProducts$();

  createProduct(payload: ProductWritePayload): Promise<void> {
    return this.products.createProduct(payload);
  }

  updateProduct(id: string, payload: ProductWritePayload): Promise<void> {
    return this.products.updateProduct(id, payload);
  }

  deleteProduct(id: string): Promise<void> {
    return this.products.deleteProduct(id);
  }
}
