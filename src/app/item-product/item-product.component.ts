import { Component, Input } from '@angular/core';
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
 
 
  toggleFavorite(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.isFavorite = !this.isFavorite;
  }
 
  addToCart(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    console.log('Add to cart:', this.product.id);
  }

}
