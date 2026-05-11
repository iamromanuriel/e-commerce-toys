import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ShoppingCart, MessageCircle, Search } from 'lucide-angular';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-top-bar-component',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './top-bar-component.component.html',
  styleUrl: './top-bar-component.component.css'
})
export class TopBarComponentComponent {
  @Output() searchChange = new EventEmitter<string>();
  @Output() openCart = new EventEmitter<void>();

  private cartService = inject(CartService);

  cartCount = 0;
  whatsappNumber = '527461113626'; // Cambia por tu número real
  readonly shoppingCartIcon = ShoppingCart;
  readonly messageCircleIcon = MessageCircle;
  readonly searchIcon = Search;

  constructor() {
    this.cartService.cart$.subscribe(cart => {
      this.cartCount = this.cartService.getTotalItems();
    });
  }

  openWhatsApp(): void {
    const url = `https://wa.me/${this.whatsappNumber}?text=Hola%20quiero%20más%20información`;
    window.open(url, '_blank');
  }

  openCartClick(): void {
    this.openCart.emit();
  }

  onSearchTerm(value: string): void {
    this.searchChange.emit(value);
  }
}
