## TourGuard - Deployment Anleitung

### Lokale Entwicklung

1. **Repository klonen:**

```bash
git clone <repository-url>
cd tourguard
```

2. **Environment Variablen:**

```bash
# Backend
cp backend/.env.example backend/.env
# Frontend
cp frontend/.env.example frontend/.env
```

3. **Mit Docker starten:**

```bash
docker-compose up --build
```

4. **Manuell starten (Development):**

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (neues Terminal)
cd frontend
npm install
npm run dev
```

### Produktionsumgebung

1. **Environment Variablen anpassen:**

- JWT_SECRET mit sicherem Wert
- SMS_API_KEY für SMS-Provider
- Datenbankverbindung

2. **Docker Production:**

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Datenbank Setup

PostgreSQL Schema wird automatisch initialisiert.

### SMS Integration

Aktuell beispielhafte Integration. Für Produktion:

1. SMS-Provider auswählen (z.B. Twilio, MessageBird)
2. API-Keys in Environment Variables setzen
3. notificationService.ts anpassen

### Monitoring

- Backend läuft automatisches Checkout-Monitoring
- Überprüft alle 15 Minuten auf überfällige Touren
- Sendet automatisch SMS-Benachrichtigungen

### API Endpunkte

Base URL: `http://localhost:3001/api`

**Authentication:**

- `POST /auth/register` - Registrierung
- `POST /auth/login` - Anmeldung
- `GET /auth/me` - Benutzer-Profil

**Tours:**

- `POST /tours` - Tour erstellen
- `GET /tours` - Eigene Touren
- `GET /tours/:id` - Tour Details
- `PUT /tours/:id` - Tour bearbeiten
- `DELETE /tours/:id` - Tour löschen
- `POST /tours/:id/checkin` - Check-in
- `POST /tours/:id/checkout` - Check-out
- `POST /tours/:id/gpx` - GPX Upload
- `GET /tours/:id/emergency` - Notfalldaten (öffentlich)

### Sicherheitshinweise

- JWT Secret ändern
- HTTPS in Produktion
- Rate Limiting implementieren
- Input Validation erweitern
- Logs monitoren
