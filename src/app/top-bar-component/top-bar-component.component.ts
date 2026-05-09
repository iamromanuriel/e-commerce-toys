import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-bar-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-bar-component.component.html',
  styleUrl: './top-bar-component.component.css'
})
export class TopBarComponentComponent {
  cartCount = 3;
  whatsappNumber = '521234567890'; // Cambia por tu número real
 
  openWhatsApp(): void {
    const url = `https://wa.me/${this.whatsappNumber}`;
    window.open(url, '_blank');
  }
 
  openCart(): void {
    // Lógica para abrir el carrito
    console.log('Abrir carrito');
  }

}
