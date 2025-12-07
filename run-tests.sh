#!/bin/bash

# TourGuard Test Runner Script
# Führt alle Tests für Frontend und Backend aus

set -e

echo "🧪 TourGuard - Vollständige Test-Suite"
echo "====================================="

# Farben für bessere Ausgabe
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fehler-Handler
handle_error() {
    echo -e "${RED}❌ Tests fehlgeschlagen in $1${NC}"
    exit 1
}

# Frontend Tests
echo -e "${YELLOW}📱 Frontend Tests${NC}"
echo "-------------------"

cd frontend

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm ist nicht installiert${NC}"
    exit 1
fi

# Dependencies installieren falls nicht vorhanden
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install || handle_error "Frontend dependency installation"
fi

# Frontend Unit Tests
echo "🔍 Unit Tests..."
npm run test -- --run || handle_error "Frontend unit tests"

# Frontend Coverage
echo "📊 Coverage Report..."
npm run test:coverage -- --run || handle_error "Frontend coverage"

cd ..

# Backend Tests
echo -e "${YELLOW}🔧 Backend Tests${NC}"
echo "-------------------"

cd backend

# Dependencies installieren falls nicht vorhanden
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install || handle_error "Backend dependency installation"
fi

# Backend Unit Tests
echo "🔍 Unit Tests..."
npm run test:unit || handle_error "Backend unit tests"

# Backend Integration Tests
echo "🔗 Integration Tests..."
npm run test:integration || handle_error "Backend integration tests"

# Backend Coverage
echo "📊 Coverage Report..."
npm run test:coverage || handle_error "Backend coverage"

cd ..

# Erfolg
echo ""
echo -e "${GREEN}✅ Alle Tests erfolgreich bestanden!${NC}"
echo ""
echo "📊 Coverage Reports:"
echo "   Frontend: frontend/coverage/index.html"
echo "   Backend:  backend/coverage/index.html"
echo ""
echo "🚀 TourGuard ist bereit für Deployment!"