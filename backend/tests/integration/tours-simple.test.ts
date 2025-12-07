import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import tourRoutes from "../../src/routes/tourRoutes";
import { auth } from "../../src/middleware/auth";
import { db } from "../../src/config/database";
import "../setup";

const app = express();
app.use(express.json());
app.use("/api/tours", auth, tourRoutes);

describe("Tour Integration Tests", () => {
	let userToken: string;
	let userId: string;

	beforeEach(async () => {
		// Clean up test data before each test
		await db.raw("TRUNCATE TABLE tours, users RESTART IDENTITY CASCADE");

		// Create a test user and get token
		const [user] = await db("users")
			.insert({
				name: "Test User",
				email: "test@example.com",
				password_hash: "hashedpassword123",
				phone: "+49123456789",
			})
			.returning(["id", "email", "name"]);

		userId = user.id;
		userToken = jwt.sign(
			{ userId: user.id, email: user.email },
			process.env.JWT_SECRET || "test-secret",
			{ expiresIn: "1d" }
		);
	});

	describe("POST /api/tours", () => {
		it("sollte eine neue Tour erstellen", async () => {
			const tourData = {
				name: "Test Wanderung",
				description: "Eine schöne Testwanderung",
				startLocation: "München",
				endLocation: "Garmisch",
				startTime: "2024-12-25T10:00:00Z",
				expectedEndTime: "2024-12-25T18:00:00Z",
				emergencyContact: {
					name: "Notfallkontakt",
					phone: "01523456789",
				},
			};

			const response = await request(app)
				.post("/api/tours")
				.set("Authorization", `Bearer ${userToken}`)
				.send(tourData);

			console.log("Response status:", response.status);
			console.log("Response body:", response.body);

			expect(response.status).toBe(201);
			expect(response.body.success).toBe(true);
			expect(response.body.data.name).toBe(tourData.name);
			expect(response.body.data.startLocation).toBe(tourData.startLocation);
			expect(response.body.data.endLocation).toBe(tourData.endLocation);
			expect(response.body.data.status).toBe("planned");
		});

		it("sollte Fehler ohne Authentication zurückgeben", async () => {
			const tourData = {
				name: "Test Tour",
				startLocation: "Start",
				endLocation: "Ende",
			};

			const response = await request(app)
				.post("/api/tours")
				.send(tourData)
				.expect(401);

			expect(response.body.success).toBe(false);
			expect(response.body.error).toBe("Access token required");
		});
	});

	describe("GET /api/tours", () => {
		it("sollte alle Touren des Users zurückgeben", async () => {
			// Create test tours
			await db("tours").insert([
				{
					created_by: userId,
					name: "Tour 1",
					start_location: "München",
					end_location: "Garmisch",
					status: "planned",
					start_time: new Date(),
					expected_end_time: new Date(),
					emergency_contact: JSON.stringify({
						name: "Contact 1",
						phone: "+49123456789",
					}),
				},
				{
					created_by: userId,
					name: "Tour 2",
					start_location: "Berlin",
					end_location: "Hamburg",
					status: "active",
					start_time: new Date(),
					expected_end_time: new Date(),
					emergency_contact: JSON.stringify({
						name: "Contact 2",
						phone: "+49987654321",
					}),
				},
			]);

			const response = await request(app)
				.get("/api/tours")
				.set("Authorization", `Bearer ${userToken}`)
				.expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.data).toHaveLength(2);
			expect(response.body.data[0].name).toBe("Tour 1");
			expect(response.body.data[1].name).toBe("Tour 2");
		});
	});
});
