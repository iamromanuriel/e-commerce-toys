
import { Component, Input, Output, EventEmitter, OnChanges, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Product } from '../model/produt';


@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.css'
})
export class ProductDialogComponent implements OnChanges {
    @Input() product: Product | null = null;
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
 
  selectedImage = 0;
  selectedStorage = 0;
  selectedColor = 0;
  quantity = 1;
  isFavorite = false;
  activeTab: 'description' | 'specs' | 'reviews' = 'description';
 
  // Datos de ejemplo extendidos — en producción vendrían del @Input
  images = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80',
    'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e736f25892?w=600&q=80',
  ];
 
  storageOptions = ['64GB', '128GB', '256GB', '512GB'];
  colorOptions = [
    { label: 'Titanium', hex: '#8a8a8a' },
    { label: 'Midnight', hex: '#1c1c1e' },
    { label: 'Starlight', hex: '#f5f0e8' },
    { label: 'Blue', hex: '#1d4ed8' },
  ];

  pecs = [
    { label: 'Brand', value: 'Apple' },
    { label: 'Model', value: 'iPhone 15 Pro' },
    { label: 'Chip', value: 'A17 Pro' },
    { label: 'Display', value: '6.1" Super Retina XDR' },
    { label: 'Camera', value: '48MP Main + 12MP Ultra Wide' },
    { label: 'Battery', value: 'Up to 23h video playback' },
    { label: 'OS', value: 'iOS 17' },
    { label: 'Weight', value: '187g' },
  ];
 
  reviews = [
    { author: 'Carlos M.', rating: 5, comment: 'Increíble calidad de cámara, lo mejor que he tenido.', date: 'Apr 2025' },
    { author: 'Laura P.', rating: 4, comment: 'Muy bueno, la batería podría durar un poco más.', date: 'Mar 2025' },
    { author: 'Diego R.', rating: 5, comment: 'El diseño en titanio es espectacular.', date: 'Mar 2025' },
  ];

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
 
  ngOnChanges(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = this.isOpen ? 'hidden' : '';
    }
  }
 
  get discountPercent(): number | null {
    if (!this.product?.price) return null;
    return Math.round((1 - this.product.price / this.product.price) * 100);
  }
 
  get savings(): number | null {
    if (!this.product?.price) return null;
    return this.product.price - this.product.price;
  }
 
  get averageRating(): number {
    return this.reviews.reduce((a, r) => a + r.rating, 0) / this.reviews.length;
  }
 
  close(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
    this.closed.emit();
  }
 
  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('dialog-backdrop')) {
      this.close();
    }
  }

  changeQuantity(delta: number): void {
    this.quantity = Math.max(1, this.quantity + delta);
  }
 
  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
  }
 
  stars(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }


}
