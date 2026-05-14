import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AdminProductService } from './admin-product.service';
import { CategoryService } from '../../services/category.service';
import { NotificationService } from '../../services/notification.service';
import { Product } from '../../model/produt';
import { Category } from '../../model/category';

const URL_PATTERN = /^https?:\/\/.+/i;

const PAGE_SIZE = 10;

@Component({
  selector: 'app-products-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  providers: [AdminProductService],
  templateUrl: './products-admin.component.html',
})
export class ProductsAdminComponent {
  private readonly fb = inject(FormBuilder);
  private readonly adminProducts = inject(AdminProductService);
  private readonly categories = inject(CategoryService);
  private readonly notify = inject(NotificationService);

  readonly categoryList = toSignal(this.categories.getCategories$(), {
    initialValue: [] as Category[],
  });

  readonly allProducts = toSignal(this.adminProducts.products$, {
    initialValue: [] as Product[],
  });

  readonly currentPage = signal(1);
  readonly pageSize = PAGE_SIZE;

  readonly totalPages = computed(() => {
    const n = this.allProducts().length;
    return Math.max(1, Math.ceil(n / this.pageSize));
  });

  readonly paginatedProducts = computed(() => {
    const list = this.allProducts();
    const page = this.currentPage();
    const start = (page - 1) * this.pageSize;
    return list.slice(start, start + this.pageSize);
  });

  readonly editingId = signal<string | null>(null);
  readonly saving = signal(false);
  readonly deletingId = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    brand: ['', [Validators.required, Validators.maxLength(120)]],
    model: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.required, Validators.maxLength(2000)]],
    categoryId: ['', [Validators.required, Validators.maxLength(64)]],
    imageUrl: [
      '',
      [Validators.required, Validators.maxLength(2048), Validators.pattern(URL_PATTERN)],
    ],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0), Validators.max(999_999)]],
  });

  constructor() {
    effect(() => {
      const total = this.totalPages();
      const page = this.currentPage();
      if (page > total) {
        this.currentPage.set(total);
      }
    });
  }

  isEditing(): boolean {
    return this.editingId() !== null;
  }

  startEdit(product: Product): void {
    if (!product.id) {
      return;
    }
    this.editingId.set(product.id);
    this.form.patchValue({
      brand: product.brand,
      model: product.model,
      description: product.description,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl,
      price: product.price,
      stock: product.stock,
    });
    this.notify.show('Modo edición: actualiza los datos y guarda.');
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({
      brand: '',
      model: '',
      description: '',
      categoryId: '',
      imageUrl: '',
      price: 0,
      stock: 0,
    });
  }

  async onSubmit(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving()) {
      return;
    }

    const raw = this.form.getRawValue();
    const payload: Omit<Product, 'id'> = {
      brand: raw.brand,
      model: raw.model,
      description: raw.description,
      categoryId: raw.categoryId,
      imageUrl: raw.imageUrl,
      price: Number(raw.price),
      stock: Math.floor(Number(raw.stock)),
    };

    this.saving.set(true);
    try {
      const id = this.editingId();
      if (id) {
        await this.adminProducts.updateProduct(id, payload);
        this.notify.show('Producto actualizado correctamente.');
        this.cancelEdit();
      } else {
        await this.adminProducts.createProduct(payload);
        this.notify.show('Producto registrado correctamente.');
        this.form.reset({
          brand: '',
          model: '',
          description: '',
          categoryId: '',
          imageUrl: '',
          price: 0,
          stock: 0,
        });
      }
    } catch {
      this.notify.show('No se pudo guardar. Revisa la conexión o las reglas de Firestore.');
    } finally {
      this.saving.set(false);
    }
  }

  async confirmDelete(product: Product): Promise<void> {
    if (!product.id || this.deletingId()) {
      return;
    }
    const label = `${product.brand} ${product.model}`.trim();
    if (!confirm(`¿Eliminar el producto "${label}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    this.deletingId.set(product.id);
    try {
      await this.adminProducts.deleteProduct(product.id);
      this.notify.show('Producto eliminado.');
      if (this.editingId() === product.id) {
        this.cancelEdit();
      }
    } catch {
      this.notify.show('No se pudo eliminar el producto.');
    } finally {
      this.deletingId.set(null);
    }
  }

  goToPage(page: number): void {
    const total = this.totalPages();
    const next = Math.min(Math.max(1, page), total);
    this.currentPage.set(next);
  }

  prevPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  trackById(_: number, p: Product): string {
    return p.id ?? '';
  }

  categoryLabel(id: string, list: Category[]): string {
    const c = list.find((x) => x.id === id);
    return c?.name ?? id;
  }
}
