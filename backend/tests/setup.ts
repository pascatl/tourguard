import { db } from "../src/config/database";

// Setup vor allen Tests
beforeAll(async () => {
	// Test-Datenbank initialisieren
	try {
		await db.raw("SELECT 1");
	} catch (error) {
		console.error("Test database connection failed:", error);
	}
});

// Cleanup nach allen Tests
afterAll(async () => {
	await db.destroy();
});

// Cleanup nach jedem Test
afterEach(async () => {
	// Alle Test-Daten löschen
	try {
		await db.raw("TRUNCATE TABLE tours, users RESTART IDENTITY CASCADE");
	} catch (error) {
		// Ignoriere Fehler wenn Tabellen nicht existieren
	}
});

export { db as testDb };
