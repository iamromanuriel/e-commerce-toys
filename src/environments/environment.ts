/**
 * Configuración por defecto (desarrollo).
 * En producción, `environment.production.ts` sustituye este archivo vía `fileReplacements` en angular.json.
 * La API key de Firebase es pública por diseño; la seguridad real está en Firestore Security Rules.
 */
export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBynasjPx0H8Ds0Z-6kxbaE0Mfkt26KPg0',
    authDomain: 'e-commerce-a2486.firebaseapp.com',
    projectId: 'e-commerce-a2486',
    storageBucket: 'e-commerce-a2486.firebasestorage.app',
    messagingSenderId: '105605320394',
    appId: '1:105605320394:web:0a89e2ca6c744612746e33',
    measurementId: 'G-Y6RZKPM1VV',
  },
  /** Número de WhatsApp de la tienda: solo dígitos (incluye código de país), sin + ni espacios. */
  whatsappPhoneDigits: '522225218638',
};
