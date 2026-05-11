import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  productId: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'cart';
  private cartSubject = new BehaviorSubject<CartItem[]>(this.getCartFromStorage());
  cart$ = this.cartSubject.asObservable();

  addToCart(productId: string, quantity: number = 1): void {
    const cart = this.getCartFromStorage();
    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }
    this.saveCartToStorage(cart);
    this.cartSubject.next(cart);
  }

  removeFromCart(productId: string): void {
    const cart = this.getCartFromStorage().filter(item => item.productId !== productId);
    this.saveCartToStorage(cart);
    this.cartSubject.next(cart);
  }

  updateQuantity(productId: string, quantity: number): void {
    const cart = this.getCartFromStorage();
    const item = cart.find(item => item.productId === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
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

  private getCartFromStorage(): CartItem[] {
    if (typeof window === 'undefined' || !window.localStorage) {
      return [];
    }

    try {
      const cartJson = window.localStorage.getItem(this.cartKey);
      return cartJson ? JSON.parse(cartJson) : [];
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
      // Ignorar errores de escritura en storage
    }
  }
}