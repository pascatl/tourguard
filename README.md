# TourGuard - Bergtour-Sicherheitssystem

TourGuard ist eine Webanwendung zur Verwaltung und Sicherheit bei Bergtouren. Das System ermöglicht es, wichtige Informationen für Notfälle zu hinterlegen und bietet eine Check-in/Check-out Funktionalität mit automatischen SMS-Benachrichtigungen.

## Features

- 📍 **Routenplanung**: GPX-Import und interaktive Kartenbearbeitung mit MapLibre
- 👥 **Teilnehmerverwaltung**: Erfassung aller Tour-Teilnehmer
- 🎒 **Ausrüstungsliste**: Dokumentation der mitgeführten Ausrüstung
- ⏰ **Check-in/Check-out**: Sicherheitsfunktion für Tour-Status
- 📱 **SMS-Benachrichtigung**: Automatische Warnung bei verspätetem Check-out
- 🚨 **Notfallinfo**: Alle relevanten Daten für den Rettungsdienst

## Technologien

- **Frontend**: React, TypeScript, Vite, MapLibre GL JS
- **Backend**: Node.js, Express, PostgreSQL
- **Deployment**: Docker, Docker Compose
- **Testing**: Vitest, Jest, React Testing Library, Supertest
- **Mapping**: MapLibre GL JS für Kartendarstellung
- **SMS**: Integration für Benachrichtigungen

## Schnellstart

```bash
# Repository klonen
git clone <repository>
cd tourguard

# Mit Docker starten
docker-compose up --build

# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
```

## Projektstruktur

```
tourguard/
├── frontend/          # React/TypeScript Frontend
├── backend/           # Node.js/Express API
├── database/          # PostgreSQL Schema & Migrations
├── docker-compose.yml # Container Orchestrierung
└── README.md
```

## Entwicklung

### Lokale Entwicklung

```bash
# Backend starten
cd backend
npm install
npm run dev

# Frontend starten (neues Terminal)
cd frontend
npm install
npm run dev
```

### Testing

TourGuard verfügt über ein umfassendes Test-Framework. Details siehe [TESTING.md](./TESTING.md).

```bash
# Alle Tests ausführen
./run-tests.sh

# Frontend Tests
cd frontend && npm test

# Backend Tests
cd backend && npm test

# Tests in Docker
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

### Test Coverage

- **Frontend**: Unit Tests, Component Tests, Integration Tests
- **Backend**: Unit Tests, API Tests, Database Tests
- **E2E**: Komplette User-Workflows

### Datenbank

Die PostgreSQL Datenbank läuft in einem Docker Container. Schema wird automatisch beim ersten Start initialisiert.

## API Endpoints

- `POST /api/tours` - Neue Tour erstellen
- `GET /api/tours/:id` - Tour Details abrufen
- `POST /api/tours/:id/checkin` - Check-in durchführen
- `POST /api/tours/:id/checkout` - Check-out durchführen
- `GET /api/tours/:id/emergency` - Notfalldaten abrufen

## License

MIT License
