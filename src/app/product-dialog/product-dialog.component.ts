import { Component, EventEmitter, Input, OnChanges, Output, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LucideAngularModule, X, Truck, Shield, Star, Heart } from 'lucide-angular';
import { Product } from '../model/produt';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.css'
})
export class ProductDialogComponent implements OnChanges {
  @Input() product: Product | null = null;
  @Output() close = new EventEmitter<void>();

  quantity = 1;
  isFavorite = false;
  activeTab: 'description' | 'details' | 'reviews' = 'description';

  readonly xIcon = X;
  readonly truckIcon = Truck;
  readonly shieldIcon = Shield;
  readonly starIcon = Star;
  readonly heartIcon = Heart;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  get productFeatures() {
  return [
    { label: 'Marca', value: this.product?.brand || 'Sin datos' },
    { label: 'Modelo', value: this.product?.model || 'Sin datos' },
    { label: 'Categoría', value: this.product?.categoryId || 'Sin categoría' },
    { label: 'Stock', value: (this.product?.stock ?? 0) > 0 ? `${this.product!.stock} disponibles` : 'No disponible' },
    { label: 'Material', value: 'Plástico resistente' },
    { label: 'Edad recomendada', value: '+3 años' },
    { label: 'Garantía', value: '6 meses' },
  ];
}

  get reviews() {
    return [
      { author: 'Carlos M.', rating: 5, comment: 'Increíble calidad y detalles en el acabado.', date: 'Abr 2025' },
      { author: 'Laura P.', rating: 4, comment: 'Cómodo y muy divertido.', date: 'Mar 2025' },
      { author: 'Diego R.', rating: 5, comment: 'Perfecto para un regalo, muy buena presentación.', date: 'Mar 2025' },
    ];
  }

  ngOnChanges(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = this.product ? 'hidden' : '';
    }
  }

  closeDialog(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('dialog-backdrop')) {
      this.closeDialog();
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
