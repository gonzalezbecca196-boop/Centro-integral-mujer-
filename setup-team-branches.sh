#!/usr/bin/env bash
# Script para inicializar y verificar las 3 ramas del equipo

echo "🚀 Configurando ramas para el equipo..."

# Asegurarse de estar en main
git checkout main 2>/dev/null || git checkout -b main

# Crear las 3 ramas si no existen
git branch feature/pantalla-principal-y-agenda 2>/dev/null && echo "✅ Rama feature/pantalla-principal-y-agenda creada" || echo "ℹ️ Rama feature/pantalla-principal-y-agenda ya existía"
git branch feature/base-de-datos-y-diseno 2>/dev/null && echo "✅ Rama feature/base-de-datos-y-diseno creada" || echo "ℹ️ Rama feature/base-de-datos-y-diseno ya existía"
git branch feature/comunicacion-y-conexion 2>/dev/null && echo "✅ Rama feature/comunicacion-y-conexion creada" || echo "ℹ️ Rama feature/comunicacion-y-conexion ya existía"

echo ""
echo "📋 Ramas disponibles en tu repositorio local:"
git branch -a

echo ""
echo "👉 Para cambiarte a tu rama de trabajo, ejecuta:"
echo "   git checkout feature/pantalla-principal-y-agenda"
echo "   git checkout feature/base-de-datos-y-diseno"
echo "   git checkout feature/comunicacion-y-conexion"
