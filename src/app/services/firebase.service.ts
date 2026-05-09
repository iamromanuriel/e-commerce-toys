// src/app/services/logistica.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

export interface Entrega {
  id?: string;
  destinatario: string;
  direccion: string;
  estado: 'pendiente' | 'en_camino' | 'entregado';
  fechaCreacion?: unknown; // serverTimestamp
}

@Injectable({
  providedIn: 'root',
})
export class LogisticaService {
  // ✅ inject() en lugar de constructor — estilo moderno Angular 18
  private firestore = inject(Firestore);

  private entregasCollection = collection(this.firestore, 'entregas');

  /**
   * Obtiene las entregas en tiempo real como Observable.
   * Ordenadas por fecha de creación descendente.
   */
  getEntregas$(): Observable<Entrega[]> {
    const q = query(this.entregasCollection, orderBy('fechaCreacion', 'desc'));
    // { idField: 'id' } agrega el ID del documento a cada objeto
    return collectionData(q, { idField: 'id' }) as Observable<Entrega[]>;
  }

  /**
   * Versión reactiva con Signal (usando toSignal de rxjs-interop).
   * Retorna un Signal<Entrega[]> directamente usable en el template.
   * Debe llamarse dentro de un contexto de inyección (constructor / campo de clase).
   */
  readonly entregas = toSignal(this.getEntregas$(), {
    initialValue: [] as Entrega[],
  });

  /**
   * Signal computado: total de entregas pendientes.
   */
  readonly totalPendientes = computed(
    () => this.entregas().filter((e) => e.estado === 'pendiente').length
  );

  /**
   * Agrega un nuevo documento a la colección 'entregas'.
   */
  async agregarEntrega(entrega: Omit<Entrega, 'id' | 'fechaCreacion'>): Promise<void> {
    await addDoc(this.entregasCollection, {
      ...entrega,
      fechaCreacion: serverTimestamp(), // ✅ Timestamp del servidor, no del cliente
    });
  }
}