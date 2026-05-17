#!/usr/bin/env node

/**
 * Script de inicio para Firebase App Hosting (Cloud Run)
 * Reintentos automáticos de conexión a Firestore
 */

import { createServer } from 'http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Importar el app Express desde el build
const __dirname = dirname(fileURLToPath(import.meta.url));

// Esperar a que el módulo sea importable (en caso de que se esté compilando)
let appModule;
let retries = 0;
const maxRetries = 30;

async function loadApp() {
  try {
    const distPath = join(__dirname, 'dist', 'e-commerce-deliver-toys', 'server', 'server.mjs');
    appModule = await import(`file://${distPath}`);
    console.log('✅ Aplicación cargada exitosamente');
    return appModule;
  } catch (error) {
    retries++;
    if (retries < maxRetries) {
      console.log(`⏳ Reintentando cargar la aplicación... (${retries}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return loadApp();
    } else {
      console.error('❌ Error: No se pudo cargar la aplicación después de múltiples intentos');
      console.error(error);
      process.exit(1);
    }
  }
}

async function start() {
  const app = await loadApp();
  
  if (!app || !app.app || typeof app.app !== 'function') {
    console.error('❌ Error: El módulo no exporta una función app()');
    process.exit(1);
  }

  const port = process.env.PORT || 4000;
  const server = createServer(app.app());

  server.listen(port, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${port}`);
    console.log(`📦 Entorno: ${process.env.NODE_ENV || 'development'}`);
  });

  // Manejo de señales para shutdown graceful
  process.on('SIGTERM', () => {
    console.log('⚠️ Señal SIGTERM recibida, cerrando servidor...');
    server.close(() => {
      console.log('✅ Servidor cerrado');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('⚠️ Señal SIGINT recibida, cerrando servidor...');
    server.close(() => {
      console.log('✅ Servidor cerrado');
      process.exit(0);
    });
  });
}

start().catch(error => {
  console.error('❌ Error durante el inicio:', error);
  process.exit(1);
});
