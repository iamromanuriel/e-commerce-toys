import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp, getApp } from '@angular/fire/app';
import { initializeFirestore, provideFirestore } from '@angular/fire/firestore';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),

    // ✅ Solo se inicializa UNA vez
    provideFirebaseApp(() => initializeApp(environment.firebase)),

    // ✅ getApp() reutiliza la instancia ya creada arriba
    provideFirestore(() =>
      initializeFirestore(getApp(), {
        experimentalForceLongPolling: true,
        ignoreUndefinedProperties: true,
      })
    ),
  ],
};