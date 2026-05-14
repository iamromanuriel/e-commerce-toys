import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ShoppingCart, MessageCircle, Search } from 'lucide-angular';
import { CartService } from '../services/cart.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-top-bar-component',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './top-bar-component.component.html',
  styleUrl: './top-bar-component.component.css'
})
export class TopBarComponentComponent {
  @Output() searchChange = new EventEmitter<string>();
  @Output() openCart = new EventEmitter<void>();

  private cartService = inject(CartService);

  cartCount = 0;
  readonly shoppingCartIcon = ShoppingCart;
  readonly messageCircleIcon = MessageCircle;
  readonly searchIcon = Search;

  constructor() {
    this.cartService.cart$.subscribe(cart => {
      this.cartCount = this.cartService.getTotalItems();
    });
  }

  openWhatsApp(): void {
    const phone = environment.whatsappPhoneDigits.replace(/\D/g, '');
    if (!phone) {
      return;
    }
    const url = `https://wa.me/${phone}?text=${encodeURIComponent('Hola, quiero más información')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  openCartClick(): void {
    this.openCart.emit();
  }

  onSearchTerm(value: string): void {
    this.searchChange.emit(value);
  }
}
