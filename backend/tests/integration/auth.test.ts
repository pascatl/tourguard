import request from "supertest";
import express from "express";
import { authRoutes } from "../../src/routes/authRoutes";
import { testDb } from "../setup";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("Authentication API", () => {
	beforeEach(async () => {
		// Datenbank für jeden Test zurücksetzen
		await testDb.raw("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
	});

	describe("POST /api/auth/register", () => {
		it("registriert einen neuen Benutzer erfolgreich", async () => {
			const userData = {
				name: "Test User",
				email: "test@example.com",
				password: "password123",
			};

			const response = await request(app)
				.post("/api/auth/register")
				.send(userData)
				.expect(201);

			expect(response.body).toHaveProperty("user");
			expect(response.body).toHaveProperty("token");
			expect(response.body.user.email).toBe(userData.email);
			expect(response.body.user.name).toBe(userData.name);
			expect(response.body.user).not.toHaveProperty("password");
		});

		it("verhindert Registrierung mit existierender E-Mail", async () => {
			const userData = {
				name: "Test User",
				email: "test@example.com",
				password: "password123",
			};

			// Ersten Benutzer registrieren
			await request(app).post("/api/auth/register").send(userData).expect(201);

			// Versuchen, zweiten Benutzer mit gleicher E-Mail zu registrieren
			const response = await request(app)
				.post("/api/auth/register")
				.send(userData)
				.expect(400);

			expect(response.body.error).toContain("E-Mail bereits registriert");
		});

		it("validiert Eingabefelder", async () => {
			const invalidData = {
				name: "",
				email: "invalid-email",
				password: "123",
			};

			const response = await request(app)
				.post("/api/auth/register")
				.send(invalidData)
				.expect(400);

			expect(response.body).toHaveProperty("errors");
			expect(response.body.errors).toContain("Name ist erforderlich");
			expect(response.body.errors).toContain("Gültige E-Mail erforderlich");
			expect(response.body.errors).toContain(
				"Passwort muss mindestens 6 Zeichen haben"
			);
		});
	});

	describe("POST /api/auth/login", () => {
		beforeEach(async () => {
			// Testbenutzer für Login-Tests erstellen
			await request(app).post("/api/auth/register").send({
				name: "Test User",
				email: "test@example.com",
				password: "password123",
			});
		});

		it("meldet Benutzer erfolgreich an", async () => {
			const loginData = {
				email: "test@example.com",
				password: "password123",
			};

			const response = await request(app)
				.post("/api/auth/login")
				.send(loginData)
				.expect(200);

			expect(response.body).toHaveProperty("user");
			expect(response.body).toHaveProperty("token");
			expect(response.body.user.email).toBe(loginData.email);
		});

		it("verhindert Login mit falscher E-Mail", async () => {
			const loginData = {
				email: "wrong@example.com",
				password: "password123",
			};

			const response = await request(app)
				.post("/api/auth/login")
				.send(loginData)
				.expect(401);

			expect(response.body.error).toContain("Ungültige Anmeldedaten");
		});

		it("verhindert Login mit falschem Passwort", async () => {
			const loginData = {
				email: "test@example.com",
				password: "wrongpassword",
			};

			const response = await request(app)
				.post("/api/auth/login")
				.send(loginData)
				.expect(401);

			expect(response.body.error).toContain("Ungültige Anmeldedaten");
		});
	});
});
