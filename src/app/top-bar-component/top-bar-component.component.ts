import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ShoppingCart, User, MessageCircle } from 'lucide-angular';

@Component({
  selector: 'app-top-bar-component',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './top-bar-component.component.html',
  styleUrl: './top-bar-component.component.css'
})
export class TopBarComponentComponent {
  cartCount = 3;
  whatsappNumber = '521234567890'; // Cambia por tu número real
  readonly shoppingCartIcon = ShoppingCart;
  readonly userIcon = User;
  readonly messageCircleIcon = MessageCircle;
 
  openWhatsApp(): void {
    const url = `https://wa.me/${this.whatsappNumber}`;
    window.open(url, '_blank');
  }
 
  openCart(): void {
    // Lógica para abrir el carrito
    console.log('Abrir carrito');
  }

}
