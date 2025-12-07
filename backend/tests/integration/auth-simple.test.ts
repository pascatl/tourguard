import request from "supertest";
import express from "express";
import authRoutes from "../../src/routes/authRoutes";
import { db } from "../../src/config/database";
import "../setup";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("Auth Integration Tests", () => {
	beforeEach(async () => {
		// Clean up test data before each test
		await db.raw("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
	});

	describe("POST /api/auth/register", () => {
		it("sollte einen neuen User registrieren", async () => {
			const userData = {
				name: "Test User",
				email: "test@example.com",
				password: "password123",
			};

			const response = await request(app)
				.post("/api/auth/register")
				.send(userData)
				.expect(201);

			expect(response.body.success).toBe(true);
			expect(response.body.message).toBe("User registered successfully");
			expect(response.body.data.token).toBeDefined();
		});

		it("sollte Fehler bei doppelter Email zurückgeben", async () => {
			const userData = {
				name: "Test User",
				email: "test@example.com",
				password: "password123",
			};

			// First registration
			await request(app).post("/api/auth/register").send(userData);

			// Second registration with same email
			const response = await request(app)
				.post("/api/auth/register")
				.send(userData)
				.expect(409);

			expect(response.body.success).toBe(false);
			expect(response.body.error).toBe("User with this email already exists");
		});
	});

	describe("POST /api/auth/login", () => {
		beforeEach(async () => {
			// Register a test user before each login test
			await request(app).post("/api/auth/register").send({
				name: "Test User",
				email: "test@example.com",
				password: "password123",
			});
		});

		it("sollte User erfolgreich einloggen", async () => {
			const response = await request(app)
				.post("/api/auth/login")
				.send({
					email: "test@example.com",
					password: "password123",
				})
				.expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.message).toBe("Login successful");
			expect(response.body.data.token).toBeDefined();
		});

		it("sollte Fehler bei falschen Credentials zurückgeben", async () => {
			const response = await request(app)
				.post("/api/auth/login")
				.send({
					email: "test@example.com",
					password: "wrongpassword",
				})
				.expect(401);

			expect(response.body.success).toBe(false);
			expect(response.body.error).toBe("Invalid credentials");
		});
	});
});
