import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Product } from '../model/produt';

@Component({
  selector: 'app-item-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-product.component.html',
  styleUrl: './item-product.component.css'
})
export class ItemProductComponent {
  @Input({ required: true }) product!: Product;
  @Output() productSelected = new EventEmitter<Product>();
  @Output() addToCartProduct = new EventEmitter<Product>();

  addToCart(event: MouseEvent): void {
    event.stopPropagation();
    this.addToCartProduct.emit(this.product);
  }

  cardOnClick(): void {
    this.productSelected.emit(this.product);
  }
}
