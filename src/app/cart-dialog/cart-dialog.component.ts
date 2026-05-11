import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X, Trash2 } from 'lucide-angular';
import { CartService, CartItem } from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { Product } from '../model/produt';
import { combineLatest, firstValueFrom, map, Observable } from 'rxjs';

interface CartItemWithProduct extends CartItem {
  product: Product;
}

@Component({
  selector: 'app-cart-dialog',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './cart-dialog.component.html',
  styleUrl: './cart-dialog.component.css'
})
export class CartDialogComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  private cartService = inject(CartService);
  private productService = inject(ProductService);

  cartItemsWithProducts$: Observable<CartItemWithProduct[]> = new Observable();
  total$: Observable<number> = new Observable(); // 👈 Cambiado a observable

  readonly xIcon = X;
  readonly trashIcon = Trash2;

  ngOnInit(): void {
    this.cartItemsWithProducts$ = combineLatest([
      this.cartService.cart$,
      this.productService.getProducts$()
    ]).pipe(
      map(([cartItems, products]) => {
        const productMap = new Map(products.map(p => [p.id, p]));
        return cartItems.map(item => ({
          ...item,
          product: productMap.get(item.productId)!
        })).filter(item => item.product);
      })
    );

    // 👷 Observable reactivo para el total
    this.total$ = this.cartItemsWithProducts$.pipe(
      map(items => items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0))
    );
  }

  closeDialog(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('dialog-backdrop')) {
      this.closeDialog();
    }
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
    } else {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  async finalizePurchase(): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    const items = await firstValueFrom(this.cartItemsWithProducts$);
    if (items.length === 0) {
      return;
    }

    console.log('Finalizando compra con los siguientes items:', items);
    const currentTotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const message = this.generateWhatsAppMessage(items, currentTotal);
    console.log('Mensaje de WhatsApp generado:', message);
    const whatsappUrl = `https://wa.me/522225218638?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  private generateWhatsAppMessage(items: CartItemWithProduct[], total: number): string {
    let message = 'Hola, me gustaría comprar los siguientes productos:\n\n';
    items.forEach(item => {
      message += `${item.product.brand} ${item.product.model}\n`;
      message += `Cantidad: ${item.quantity}\n`;
      message += `Precio unitario: ${item.product.price} MXN\n`;
      message += `Subtotal: ${item.product.price * item.quantity} MXN\n\n`;
    });
    message += `Total: ${total} MXN\n\n`;
    message += 'Por favor, confirma la disponibilidad y el método de pago.';
    return message;
  }
}