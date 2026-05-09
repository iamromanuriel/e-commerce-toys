import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp, getApp } from '@angular/fire/app';
import { initializeFirestore, provideFirestore } from '@angular/fire/firestore';
import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyBynasjPx0H8Ds0Z-6kxbaE0Mfkt26KPg0",
  authDomain: "e-commerce-a2486.firebaseapp.com",
  projectId: "e-commerce-a2486",
  storageBucket: "e-commerce-a2486.firebasestorage.app",
  messagingSenderId: "105605320394",
  appId: "1:105605320394:web:0a89e2ca6c744612746e33",
  measurementId: "G-Y6RZKPM1VV"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),

    // ✅ Solo se inicializa UNA vez
    provideFirebaseApp(() => initializeApp(firebaseConfig)),

    // ✅ getApp() reutiliza la instancia ya creada arriba
    provideFirestore(() =>
      initializeFirestore(getApp(), {
        experimentalForceLongPolling: true,
        ignoreUndefinedProperties: true,
      })
    ),
  ],
};