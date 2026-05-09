// src/app/components/entregas/entregas.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogisticaService, Entrega } from '../services/firebase.service';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { Product } from '../model/produt';
import { Category } from '../model/category';

@Component({
  selector: 'app-entregas',
  standalone: true,      // ✅ Standalone — sin NgModule
  imports: [CommonModule],
  template: `
    <section class="entregas-container">
      <header>
        <h1>Gestión de Entregas</h1>
        <span class="badge">
          {{ logisticaService.totalPendientes() }} pendiente(s)
        </span>
      </header>

      <!-- Formulario rápido para agregar entrega -->
      <div class="form-nueva-entrega">
        <input
          type="text"
          placeholder="Destinatario"
          [value]="nuevoDestinatario()"
          (input)="nuevoDestinatario.set($any($event.target).value)"
        />
        <input
          type="text"
          placeholder="Dirección"
          [value]="nuevaDireccion()"
          (input)="nuevaDireccion.set($any($event.target).value)"
        />
        <button (click)="agregarEntrega()" [disabled]="cargando()">
          {{ cargando() ? 'Guardando...' : '+ Agregar Entrega' }}
        </button>
      </div>

      <!-- ✅ Nueva sintaxis @for de Angular 17/18 -->
      @for (entrega of logisticaService.entregas(); track entrega.id) {
        <div class="entrega-card" [class]="entrega.estado">
          <strong>{{ entrega.destinatario }}</strong>
          <span>{{ entrega.direccion }}</span>
          <span class="estado-badge">{{ entrega.estado }}</span>
        </div>
      } @empty {
        <p class="empty-state">No hay entregas registradas aún.</p>
      }
    </section>
  `,
})
export class EntregasComponent {
  // ✅ inject() — sin constructor
  logisticaService = inject(LogisticaService);
  productService = inject(ProductService);
  categoryService = inject(CategoryService);

  // Signals locales para el formulario
  nuevoDestinatario = signal('');
  nuevaDireccion = signal('');
  cargando = signal(false);

  async agregarEntrega(): Promise<void> {
    if (!this.nuevoDestinatario() || !this.nuevaDireccion()) return;

    this.cargando.set(true);
    try {
      await this.logisticaService.agregarEntrega({
        destinatario: this.nuevoDestinatario(),
        direccion: this.nuevaDireccion(),
        estado: 'pendiente',
      });
      // Limpiar formulario tras éxito
      this.nuevoDestinatario.set('');
      this.nuevaDireccion.set('');
    } catch (error) {
      console.error('Error al agregar entrega:', error);
    } finally {
      this.cargando.set(false);
    }
  }

  async ngOnInit(): Promise<void> {
    // Cargar entregas al iniciar el componente (opcional, ya que el Signal se actualiza automáticamente)
    this.productService.getProducts$().subscribe((products: Product[]) => {
      console.log('Productos disponibles:', products);
    }
    );


    this.categoryService.getCategories$().subscribe((categories: Category[]) => {
      console.log('Categorías disponibles:', categories);
    }
    );
  }
}