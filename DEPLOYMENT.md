# 🚀 Guía de Deployment en Firebase

Este proyecto está configurado para desplegarse en **Firebase App Hosting** con Server-Side Rendering (SSR) completo.

## 📋 Requisitos Previos

1. **Node.js 18+** instalado
2. **Firebase CLI** instalado globalmente:
   ```bash
   npm install -g firebase-tools
   ```
3. **Cuenta de Google** con un proyecto Firebase activo
4. **Acceso al proyecto** `e-commerce-a2486` en Firebase

## ✅ Verificar Instalación

```bash
# Verificar Node.js
node --version

# Verificar Firebase CLI
firebase --version

# Verificar acceso a proyectos Firebase
firebase projects:list
```

## 🔐 Autenticación

Antes de desplegar, debes autenticarte con Google:

```bash
firebase login
```

El proyecto ya está configurado en `.firebaserc` para usar `e-commerce-a2486`.

## 📦 Estructura de Deployment

El proyecto usa:
- **Dockerfile**: Empaqueta la aplicación Angular SSR
- **App Hosting**: Despliega automáticamente desde Git a Cloud Run
- **firebase.json**: Configura routing y servicios

```
├── Dockerfile          → Instrucciones para construir imagen Docker
├── app.json            → Configuración de App Hosting
├── firebase.json       → Configuración de Firebase Hosting y App Hosting
├── cloudbuild.yaml     → Pipeline de Cloud Build (opcional)
└── dist/               → Output compilado (generado por build)
```

## 🔧 Opciones de Deployment

### Opción 1: Deployment Local (Recomendado para primeros intentos)

Compila localmente y despliega:

```bash
# Build + Deploy
npm run build
firebase deploy

# O usar el script:
bash deploy.sh
```

### Opción 2: Deployment Automático desde Git

Si conectas tu repositorio a Firebase (App Hosting):

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto `e-commerce-a2486`
3. App Hosting → Conecta tu repositorio
4. Cada push a `main` se deploya automáticamente

### Opción 3: Google Cloud Build (CI/CD Avanzado)

```bash
# Ver status de builds
gcloud builds list --project=e-commerce-a2486
```

## 📂 Scripts Disponibles

```bash
# Desarrollo local
npm start              # ng serve en http://localhost:4200

# Build para producción
npm run build          # Compila Angular + SSR

# Testing
npm test               # Ejecuta pruebas

# Firebase Deployment
firebase deploy        # Despliega todo (hosting + backend)
firebase deploy --only hosting      # Solo archivos estáticos
firebase deploy --only functions    # Solo funciones (si las hay)
bash deploy.sh        # Script con validaciones

# Testing local del servidor SSR
npm run serve:ssr:e-commerce-deliver-toys

# Emulator local (opcional)
firebase emulators:start
```

## 🐳 Docker Local (Prueba antes de desplegar)

Para probar que el Docker funciona correctamente antes de desplegar:

```bash
# Construir imagen
docker build -t e-commerce-deliver-toys:local .

# Ejecutar contenedor
docker run -p 8080:8080 \
  -e NODE_ENV=production \
  -e PORT=8080 \
  e-commerce-deliver-toys:local

# Visitar http://localhost:8080
```

## 📊 Monitoreo Post-Deployment

Una vez desplegado, puedes monitorear en:

### Firebase Console
- **URL**: https://console.firebase.google.com/project/e-commerce-a2486
- **Hosting**: Ver deployments, tráfico, logs
- **Performance**: Monitoring de velocidad

### Cloud Run (si usas App Hosting)
- **URL**: https://console.cloud.google.com/run
- **Logs**: Ver errores y output del servidor
- **Métricas**: CPU, memoria, latencia

### Analytics
- Ver cómo usuarios interactúan con la app
- Configurado automáticamente en app.config.ts

## ⚙️ Variables de Entorno

Las credenciales de Firebase están en:
- `src/environments/environment.ts` (desarrollo)
- `src/environments/environment.production.ts` (producción)

Son **públicas por diseño** - la seguridad real está en Firestore Security Rules.

Para variables **realmente secretas** (API keys de terceros):
1. Almacenarlas en Google Secret Manager
2. Accederlas en Cloud Run como variables de entorno
3. En local, usar `.env.local` (ignorado por Git)

## 🔒 Seguridad

### Firestore Security Rules
Verifica que tus Firestore Rules sean correctas:
```bash
firebase deploy --only firestore:rules
```

### CORS y Headers
Cloud Run agrega headers automáticamente. Si necesitas CORS:
- Configurar en `server.ts`
- O en Cloud Armor (más avanzado)

## 🆘 Troubleshooting

### Build falla
```bash
# Limpiar cache de Angular
rm -rf .angular/

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Recompilar
npm run build
```

### Deployment falla
```bash
# Verificar autenticación
firebase projects:list

# Ver logs de deployment
firebase deploy --debug

# Ver logs de Cloud Run
gcloud logs read --limit 50 --project=e-commerce-a2486
```

### Aplicación no carga en producción
1. Verificar que `dist/` se creó correctamente
2. Revisar logs en Cloud Run Console
3. Verificar variables de entorno de Firebase en `environment.production.ts`
4. Asegurar que Firestore Rules permiten lectura

### Puerto erróneo
Cloud Run espera aplicación en puerto **8080**. El Dockerfile ya lo configura correctamente.

## 📚 Recursos

- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)
- [Cloud Run Docs](https://cloud.google.com/run/docs)
- [Angular Deployment](https://angular.io/guide/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

## ✨ Próximos Pasos

1. **Verifica el build local**:
   ```bash
   npm run build
   npm run serve:ssr:e-commerce-deliver-toys
   ```

2. **Prueba Docker** (opcional):
   ```bash
   docker build -t test . && docker run -p 8080:8080 test
   ```

3. **Despliega**:
   ```bash
   firebase deploy
   ```

4. **Verifica en vivo**:
   - Hosting: https://e-commerce-deliver-toys.web.app
   - Cloud Run: https://console.cloud.google.com/run

¡Listo! 🚀
