import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ShoppingCart, MessageCircle, Search } from 'lucide-angular';

@Component({
  selector: 'app-top-bar-component',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './top-bar-component.component.html',
  styleUrl: './top-bar-component.component.css'
})
export class TopBarComponentComponent {
  @Output() searchChange = new EventEmitter<string>();

  cartCount = 3;
  whatsappNumber = '521234567890'; // Cambia por tu número real
  readonly shoppingCartIcon = ShoppingCart;
  readonly messageCircleIcon = MessageCircle;
  readonly searchIcon = Search;

  openWhatsApp(): void {
    const url = `https://wa.me/${this.whatsappNumber}`;
    window.open(url, '_blank');
  }

  openCart(): void {
    console.log('Abrir carrito');
  }

  onSearchTerm(value: string): void {
    this.searchChange.emit(value);
  }
}
