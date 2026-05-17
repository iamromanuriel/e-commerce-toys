#!/bin/bash

# Script de deployment a Firebase App Hosting
# Requisitos: Firebase CLI instalado y autenticado
#
# Uso: bash deploy.sh [opciones]
# Opciones:
#   --skip-build    No ejecutar build antes de desplegar
#   --only-hosting  Solo desplegar hosting (sin backend)
#   --dry-run       Simular el deployment sin hacer cambios
#

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
SKIP_BUILD=false
ONLY_HOSTING=false
DRY_RUN=""

# Parsear argumentos
while [[ $# -gt 0 ]]; do
  case $1 in
    --skip-build)
      SKIP_BUILD=true
      shift
      ;;
    --only-hosting)
      ONLY_HOSTING=true
      shift
      ;;
    --dry-run)
      DRY_RUN="--dry-run"
      shift
      ;;
    *)
      echo "Opción desconocida: $1"
      exit 1
      ;;
  esac
done

echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}  🚀 Firebase E-Commerce Deployment${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

# Verificar que Firebase CLI esté instalado
if ! command -v firebase &> /dev/null; then
  echo -e "${RED}❌ Firebase CLI no está instalado${NC}"
  echo "   Instálalo con: npm install -g firebase-tools"
  exit 1
fi

echo -e "${BLUE}ℹ️  Versión de Firebase CLI:${NC}"
firebase --version
echo ""

# Verificar autenticación
echo -e "${BLUE}ℹ️  Verificando autenticación...${NC}"
if ! firebase projects:list > /dev/null 2>&1; then
  echo -e "${YELLOW}⚠️  No autenticado. Iniciando login...${NC}"
  firebase login
fi
echo -e "${GREEN}✅ Autenticado${NC}"
echo ""

# Build del proyecto
if [ "$SKIP_BUILD" = false ]; then
  echo -e "${BLUE}📦 Compilando proyecto...${NC}"
  npm run build
  echo -e "${GREEN}✅ Build completado${NC}"
else
  echo -e "${YELLOW}⏭️  Omitiendo build (--skip-build)${NC}"
fi
echo ""

# Verificar que el build existe (carpeta que Firebase Hosting sirve)
if [ ! -f "dist/e-commerce-deliver-toys/browser/index.html" ]; then
  echo -e "${RED}❌ Error: No se encontró dist/e-commerce-deliver-toys/browser/index.html${NC}"
  echo "   Ejecuta 'npm run build' primero"
  exit 1
fi

# Deployment
echo -e "${BLUE}🚀 Iniciando deployment a Firebase...${NC}"
echo ""

if [ "$ONLY_HOSTING" = true ]; then
  echo -e "${YELLOW}📌 Desplegando solo hosting (sin backend)${NC}"
  firebase deploy --only hosting $DRY_RUN
else
  echo -e "${YELLOW}📌 Desplegando Firebase Hosting (SPA estática)${NC}"
  firebase deploy --only hosting $DRY_RUN
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ ¡Deployment completado!${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📱 Para ver tu aplicación:${NC}"
echo "   https://e-commerce-deliver-toys.web.app"
echo ""
echo -e "${BLUE}📊 Para monitorear:${NC}"
echo "   https://console.firebase.google.com/u/0/project/e-commerce-a2486"
echo ""
