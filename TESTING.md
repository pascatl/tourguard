# TourGuard Testing Framework

## 🧪 Übersicht

TourGuard verfügt über ein umfassendes Testing-Framework mit mehreren Testebenen:

- **Unit Tests**: Testen einzelne Komponenten/Funktionen isoliert
- **Integration Tests**: Testen Zusammenspiel zwischen Komponenten
- **API Tests**: Testen Backend-Endpunkte und Datenbank-Interaktionen
- **E2E Tests**: Testen komplette Benutzer-Workflows

## 🏗️ Framework-Stack

### Frontend Testing

- **Vitest**: Test-Runner (schneller als Jest für Vite-Projekte)
- **React Testing Library**: Component-Testing mit Best Practices
- **Jest-DOM**: Erweiterte DOM-Assertions
- **MSW**: API-Mocking für realistische Tests
- **User Event**: Simuliert echte Benutzer-Interaktionen

### Backend Testing

- **Jest**: Bewährter Test-Runner für Node.js
- **Supertest**: HTTP-Endpoint Testing
- **Test-Database**: Isolierte PostgreSQL-Instanz für Tests

## 📁 Test-Struktur

```
tourguard/
├── frontend/
│   ├── src/
│   │   ├── __tests__/              # Component Tests
│   │   │   ├── App.test.tsx
│   │   │   ├── DashboardPage.test.tsx
│   │   │   ├── TourCreatePage.test.tsx
│   │   │   └── integration.test.tsx
│   │   └── test/                   # Test Utilities
│   │       ├── setup.ts
│   │       └── testUtils.tsx
│   └── vitest.config.ts
├── backend/
│   ├── tests/
│   │   ├── integration/            # API Integration Tests
│   │   │   ├── auth.test.ts
│   │   │   └── tours.test.ts
│   │   ├── unit/                   # Unit Tests
│   │   └── setup.ts                # Test Configuration
│   └── jest.config.js
├── docker-compose.test.yml         # Docker Test Environment
├── run-tests.sh                    # Test Runner Script
└── .github/workflows/ci.yml        # CI/CD Pipeline
```

## 🚀 Tests ausführen

### Lokale Entwicklung

```bash
# Alle Tests ausführen
./run-tests.sh

# Nur Frontend Tests
cd frontend && npm test

# Frontend Tests mit Coverage
cd frontend && npm run test:coverage

# Frontend Tests im Watch-Mode
cd frontend && npm run test:watch

# Nur Backend Tests
cd backend && npm test

# Backend Unit Tests
cd backend && npm run test:unit

# Backend Integration Tests
cd backend && npm run test:integration
```

### Docker-Umgebung

```bash
# Tests in Docker ausführen
docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# Nur Backend Tests in Docker
docker-compose -f docker-compose.test.yml run --rm backend-test

# Nur Frontend Tests in Docker
docker-compose -f docker-compose.test.yml run --rm frontend-test
```

## 📊 Test Coverage

### Ziele

- **Frontend**: >80% Code Coverage
- **Backend**: >85% Code Coverage
- **API Endpoints**: 100% Coverage
- **Critical Paths**: 100% Coverage

### Reports anzeigen

```bash
# Frontend Coverage (Browser)
cd frontend && npm run test:coverage
open frontend/coverage/index.html

# Backend Coverage (Browser)
cd backend && npm run test:coverage
open backend/coverage/index.html
```

## ✅ Test-Kategorien

### Frontend Tests

#### 1. Component Tests

Testen einzelne React-Komponenten isoliert:

```typescript
// Beispiel: DashboardPage.test.tsx
describe("DashboardPage", () => {
	it("lädt und zeigt Touren-Statistiken", async () => {
		mockTourService.getTours.mockResolvedValue(tours);
		render(<DashboardPage {...defaultProps} />);

		await waitFor(() => {
			expect(screen.getByText("3")).toBeInTheDocument(); // Total
		});
	});
});
```

#### 2. Integration Tests

Testen komplette User-Workflows:

```typescript
// Beispiel: integration.test.tsx
it("Registrierung → Login → Tour erstellen → Dashboard anzeigen", async () => {
	// Mock API responses
	mockApi.authService.register.mockResolvedValue({ user, token });

	// Simulate user interactions
	await user.click(registerButton);
	// ... weitere Interaktionen

	// Verify expected behavior
	expect(screen.getByText("Willkommen zurück!")).toBeInTheDocument();
});
```

### Backend Tests

#### 1. API Tests

Testen HTTP-Endpunkte:

```typescript
// Beispiel: auth.test.ts
describe("POST /api/auth/login", () => {
	it("meldet Benutzer erfolgreich an", async () => {
		const response = await request(app)
			.post("/api/auth/login")
			.send({ email: "test@example.com", password: "password123" })
			.expect(200);

		expect(response.body).toHaveProperty("token");
	});
});
```

#### 2. Database Tests

Testen Datenbank-Operationen:

```typescript
// Beispiel: tours.test.ts
beforeEach(async () => {
	// Database cleanup
	await testDb.raw("TRUNCATE TABLE tours, users RESTART IDENTITY CASCADE");
});
```

## 🔧 Mock-Strategien

### Frontend Mocks

#### API Service Mocks

```typescript
const mockTourService = {
	getTours: vi.fn(),
	createTour: vi.fn(),
	updateTour: vi.fn(),
	deleteTour: vi.fn(),
};

vi.mock("../services/api", () => ({
	tourService: mockTourService,
}));
```

#### Browser API Mocks

```typescript
// localStorage Mock
global.localStorage = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn(),
};
```

### Backend Mocks

#### Database Mocks für Unit Tests

```typescript
const mockDb = {
	select: vi.fn().mockReturnThis(),
	where: vi.fn().mockReturnThis(),
	insert: vi.fn().mockReturnThis(),
	returning: vi.fn(),
};
```

## 🐛 Test-Debugging

### Frontend Debugging

```typescript
// Debug rendered HTML
render(<Component />);
screen.debug(); // Prints DOM tree

// Wait for async operations
await waitFor(() => {
	expect(screen.getByText("Loading...")).not.toBeInTheDocument();
});

// Use findBy queries for async content
const element = await screen.findByText("Async Content");
```

### Backend Debugging

```typescript
// Debug request/response
console.log("Request body:", request.body);
console.log("Response:", response.body);

// Database state inspection
const users = await testDb("users").select("*");
console.log("Current users:", users);
```

## 🔄 CI/CD Integration

### GitHub Actions Workflow

- **Pull Request**: Führt alle Tests aus
- **Main Branch**: Tests + Deployment
- **Coverage Reports**: Automatisch zu Codecov hochgeladen
- **Security Scans**: NPM Audit + Snyk

### Test-Umgebungen

- **Development**: Lokale Tests mit Hot Reload
- **CI**: Isolierte Test-Datenbank in GitHub Actions
- **Docker**: Containerisierte Tests für Konsistenz

## 📈 Test-Metriken

### Überwachte Metriken

- **Test Coverage**: Code-Abdeckung pro Modul
- **Test Duration**: Laufzeit der Test-Suite
- **Flaky Tests**: Tests mit inkonsistenten Ergebnissen
- **Security Issues**: Gefundene Sicherheitslücken

### Performance-Ziele

- **Frontend Tests**: <30 Sekunden
- **Backend Tests**: <45 Sekunden
- **E2E Tests**: <2 Minuten
- **Gesamte CI-Pipeline**: <5 Minuten

## 🎯 Best Practices

### Test-Schreibung

1. **AAA-Pattern**: Arrange, Act, Assert
2. **Descriptive Names**: Was wird getestet und was wird erwartet
3. **Single Responsibility**: Ein Test pro Verhalten
4. **Realistic Data**: Verwende realistische Test-Daten
5. **Clean Setup/Teardown**: Saubere Test-Isolation

### Test-Wartung

1. **Regular Updates**: Tests mit Code-Changes aktualisieren
2. **Refactoring**: Duplikation in Test-Code vermeiden
3. **Documentation**: Komplexe Test-Setups dokumentieren
4. **Review**: Test-Code genauso reviewen wie Produktions-Code

### Performance

1. **Parallel Execution**: Tests wo möglich parallel ausführen
2. **Efficient Mocks**: Schwere Operationen mocken
3. **Database Cleanup**: Schnelle Cleanup-Strategien
4. **Resource Management**: Memory Leaks in Tests vermeiden

## 🚨 Troubleshooting

### Häufige Probleme

#### Frontend

```bash
# "Module not found" Fehler
npm install --save-dev @testing-library/jest-dom

# "act" Warnings
await waitFor(() => {
  // async operations
});

# Mock-Fehler
vi.clearAllMocks() // in beforeEach
```

#### Backend

```bash
# Database connection errors
# Überprüfe ob Test-DB läuft
docker ps | grep postgres

# Jest timeout errors
# Erhöhe testTimeout in jest.config.js
testTimeout: 10000
```

#### Docker

```bash
# Container build failures
docker-compose -f docker-compose.test.yml build --no-cache

# Port conflicts
docker-compose -f docker-compose.test.yml down
```

## 📚 Weitere Ressourcen

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Guide](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [Supertest API Testing](https://github.com/visionmedia/supertest)
