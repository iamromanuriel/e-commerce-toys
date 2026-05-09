// src/app/components/entregas/entregas.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogisticaService, Entrega } from '../services/firebase.service';

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
}