import { Component, Input, EventEmitter, Output } from '@angular/core';
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
 
  isFavorite = false;
 
  @Output() productSelected = new EventEmitter<Product>();

  addToCart(event: MouseEvent): void {
    //event.stopPropagation();
    //event.preventDefault();
    this.productSelected.emit(this.product);
    console.log('Add to cart:', this.product.id);
  }

  cardOnClick(): void {
    console.log('Card clicked:', this.product.id);
  }

}
