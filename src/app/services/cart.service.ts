import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from './notification.service';

export interface CartItem {
  productId: string;
  quantity: number;
}

const MAX_LINES = 40;
const MAX_QTY_PER_LINE = 99;

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartKey = 'cart';
  private cartSubject = new BehaviorSubject<CartItem[]>(this.getCartFromStorage());
  cart$ = this.cartSubject.asObservable();

  private notifications = inject(NotificationService);

  addToCart(productId: string, quantity: number = 1): void {
    const pid = typeof productId === 'string' ? productId.trim() : '';
    if (!this.isValidProductId(pid)) {
      return;
    }
    const qty = Math.min(Math.max(Math.floor(Number(quantity)) || 0, 1), MAX_QTY_PER_LINE);
    const cart = this.getCartFromStorage();
    if (cart.length >= MAX_LINES && !cart.some((i) => i.productId === pid)) {
      this.notifications.show('El carrito tiene demasiados productos distintos.');
      return;
    }
    const existingItem = cart.find((item) => item.productId === pid);
    if (existingItem) {
      existingItem.quantity = Math.min(existingItem.quantity + qty, MAX_QTY_PER_LINE);
    } else {
      cart.push({ productId: pid, quantity: qty });
    }
    this.saveCartToStorage(cart);
    this.cartSubject.next(cart);
    this.notifications.show('Producto agregado al carrito');
  }

  removeFromCart(productId: string): void {
    const pid = typeof productId === 'string' ? productId.trim() : '';
    const cart = this.getCartFromStorage().filter((item) => item.productId !== pid);
    this.saveCartToStorage(cart);
    this.cartSubject.next(cart);
  }

  updateQuantity(productId: string, quantity: number): void {
    const pid = typeof productId === 'string' ? productId.trim() : '';
    if (!this.isValidProductId(pid)) {
      return;
    }
    const cart = this.getCartFromStorage();
    const item = cart.find((i) => i.productId === pid);
    if (item) {
      const q = Math.min(Math.max(Math.floor(Number(quantity)) || 0, 0), MAX_QTY_PER_LINE);
      item.quantity = q;
      if (item.quantity <= 0) {
        this.removeFromCart(pid);
        return;
      }
    }
    this.saveCartToStorage(cart);
    this.cartSubject.next(cart);
  }

  getCart(): CartItem[] {
    return this.getCartFromStorage();
  }

  getTotalItems(): number {
    return this.getCartFromStorage().reduce((total, item) => total + item.quantity, 0);
  }

  clearCart(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(this.cartKey);
    }
    this.cartSubject.next([]);
  }

  private isValidProductId(id: string): boolean {
    return id.length > 0 && id.length <= 512 && !/[/\s]/.test(id);
  }

  private parseCartJson(raw: string): CartItem[] {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return [];
    }
    if (!Array.isArray(parsed)) {
      return [];
    }
    const out: CartItem[] = [];
    for (const entry of parsed) {
      if (!entry || typeof entry !== 'object') {
        continue;
      }
      const rec = entry as Record<string, unknown>;
      const productId = rec['productId'];
      const quantity = rec['quantity'];
      if (typeof productId !== 'string' || !this.isValidProductId(productId.trim())) {
        continue;
      }
      const normalizedId = productId.trim();
      const q = Math.min(Math.max(Math.floor(Number(quantity)) || 0, 1), MAX_QTY_PER_LINE);
      if (q >= 1) {
        out.push({ productId: normalizedId, quantity: q });
      }
    }
    return out.slice(0, MAX_LINES);
  }

  private getCartFromStorage(): CartItem[] {
    if (typeof window === 'undefined' || !window.localStorage) {
      return [];
    }

    try {
      const cartJson = window.localStorage.getItem(this.cartKey);
      return cartJson ? this.parseCartJson(cartJson) : [];
    } catch {
      return [];
    }
  }

  private saveCartToStorage(cart: CartItem[]): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    try {
      window.localStorage.setItem(this.cartKey, JSON.stringify(cart));
    } catch {
      // Quota u otro error de escritura
    }
  }
}
