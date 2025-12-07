import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import tourRoutes from "../../src/routes/tourRoutes";
import { requireAuth } from "../../src/middleware/auth";
import "../setup";

const app = express();
app.use(express.json());
app.use("/api/tours", authMiddleware, tourRoutes);

describe("Tours API", () => {
	let authToken: string;
	let userId: number;

	beforeEach(async () => {
		// Datenbank für jeden Test zurücksetzen
		await testDb.raw("TRUNCATE TABLE tours, users RESTART IDENTITY CASCADE");

		// Testbenutzer erstellen
		const [user] = await testDb("users")
			.insert({
				name: "Test User",
				email: "test@example.com",
				password: "$2b$10$hashedpassword", // gehashed für Tests
			})
			.returning("*");

		userId = user.id;

		// Auth Token erstellen
		authToken = jwt.sign(
			{ userId: user.id, email: user.email },
			process.env.JWT_SECRET || "test-secret"
		);
	});

	describe("POST /api/tours", () => {
		it("erstellt eine neue Tour erfolgreich", async () => {
			const tourData = {
				name: "Test Bergtour",
				description: "Eine Testtour",
				startLocation: "München",
				endLocation: "Garmisch",
				startTime: "2025-12-08T10:00:00Z",
				expectedEndTime: "2025-12-08T16:00:00Z",
				emergencyContact: {
					name: "Max Mustermann",
					phone: "+49123456789",
				},
			};

			const response = await request(app)
				.post("/api/tours")
				.set("Authorization", `Bearer ${authToken}`)
				.send(tourData)
				.expect(201);

			expect(response.body).toHaveProperty("id");
			expect(response.body.name).toBe(tourData.name);
			expect(response.body.startLocation).toBe(tourData.startLocation);
			expect(response.body.status).toBe("planned");
			expect(response.body.userId).toBe(userId);
		});

		it("validiert erforderliche Felder", async () => {
			const invalidTourData = {
				name: "",
				startLocation: "",
				endLocation: "",
			};

			const response = await request(app)
				.post("/api/tours")
				.set("Authorization", `Bearer ${authToken}`)
				.send(invalidTourData)
				.expect(400);

			expect(response.body).toHaveProperty("errors");
			expect(response.body.errors).toContain("Name ist erforderlich");
			expect(response.body.errors).toContain("Startort ist erforderlich");
			expect(response.body.errors).toContain("Zielort ist erforderlich");
		});

		it("erfordert Authentifizierung", async () => {
			const tourData = {
				name: "Test Tour",
				startLocation: "Start",
				endLocation: "End",
			};

			await request(app).post("/api/tours").send(tourData).expect(401);
		});
	});

	describe("GET /api/tours", () => {
		beforeEach(async () => {
			// Testtouren erstellen
			await testDb("tours").insert([
				{
					name: "Tour 1",
					startLocation: "Start 1",
					endLocation: "End 1",
					startTime: "2025-12-08T10:00:00Z",
					expectedEndTime: "2025-12-08T16:00:00Z",
					status: "planned",
					userId: userId,
					emergencyContactName: "Contact 1",
					emergencyContactPhone: "+49123456789",
				},
				{
					name: "Tour 2",
					startLocation: "Start 2",
					endLocation: "End 2",
					startTime: "2025-12-09T10:00:00Z",
					expectedEndTime: "2025-12-09T16:00:00Z",
					status: "active",
					userId: userId,
					emergencyContactName: "Contact 2",
					emergencyContactPhone: "+49123456790",
				},
			]);
		});

		it("gibt alle Touren des Benutzers zurück", async () => {
			const response = await request(app)
				.get("/api/tours")
				.set("Authorization", `Bearer ${authToken}`)
				.expect(200);

			expect(response.body).toHaveLength(2);
			expect(response.body[0].name).toBe("Tour 1");
			expect(response.body[1].name).toBe("Tour 2");
		});

		it("gibt nur Touren des authentifizierten Benutzers zurück", async () => {
			// Anderen Benutzer und Tour erstellen
			const [otherUser] = await testDb("users")
				.insert({
					name: "Other User",
					email: "other@example.com",
					password: "$2b$10$hashedpassword",
				})
				.returning("*");

			await testDb("tours").insert({
				name: "Other Tour",
				startLocation: "Other Start",
				endLocation: "Other End",
				startTime: "2025-12-10T10:00:00Z",
				expectedEndTime: "2025-12-10T16:00:00Z",
				status: "planned",
				userId: otherUser.id,
				emergencyContactName: "Other Contact",
				emergencyContactPhone: "+49123456791",
			});

			const response = await request(app)
				.get("/api/tours")
				.set("Authorization", `Bearer ${authToken}`)
				.expect(200);

			// Sollte nur 2 Touren zurückgeben (nicht die des anderen Benutzers)
			expect(response.body).toHaveLength(2);
		});

		it("erfordert Authentifizierung", async () => {
			await request(app).get("/api/tours").expect(401);
		});
	});

	describe("PUT /api/tours/:id", () => {
		let tourId: number;

		beforeEach(async () => {
			const [tour] = await testDb("tours")
				.insert({
					name: "Original Tour",
					startLocation: "Original Start",
					endLocation: "Original End",
					startTime: "2025-12-08T10:00:00Z",
					expectedEndTime: "2025-12-08T16:00:00Z",
					status: "planned",
					userId: userId,
					emergencyContactName: "Original Contact",
					emergencyContactPhone: "+49123456789",
				})
				.returning("*");

			tourId = tour.id;
		});

		it("aktualisiert Tour erfolgreich", async () => {
			const updateData = {
				name: "Updated Tour",
				status: "active",
			};

			const response = await request(app)
				.put(`/api/tours/${tourId}`)
				.set("Authorization", `Bearer ${authToken}`)
				.send(updateData)
				.expect(200);

			expect(response.body.name).toBe(updateData.name);
			expect(response.body.status).toBe(updateData.status);
		});

		it("verhindert Update von Touren anderer Benutzer", async () => {
			// Anderen Benutzer und Tour erstellen
			const [otherUser] = await testDb("users")
				.insert({
					name: "Other User",
					email: "other@example.com",
					password: "$2b$10$hashedpassword",
				})
				.returning("*");

			const [otherTour] = await testDb("tours")
				.insert({
					name: "Other Tour",
					startLocation: "Other Start",
					endLocation: "Other End",
					startTime: "2025-12-10T10:00:00Z",
					expectedEndTime: "2025-12-10T16:00:00Z",
					status: "planned",
					userId: otherUser.id,
					emergencyContactName: "Other Contact",
					emergencyContactPhone: "+49123456791",
				})
				.returning("*");

			const updateData = {
				name: "Hacked Tour",
			};

			await request(app)
				.put(`/api/tours/${otherTour.id}`)
				.set("Authorization", `Bearer ${authToken}`)
				.send(updateData)
				.expect(404);
		});
	});

	describe("DELETE /api/tours/:id", () => {
		let tourId: number;

		beforeEach(async () => {
			const [tour] = await testDb("tours")
				.insert({
					name: "Tour to Delete",
					startLocation: "Start",
					endLocation: "End",
					startTime: "2025-12-08T10:00:00Z",
					expectedEndTime: "2025-12-08T16:00:00Z",
					status: "planned",
					userId: userId,
					emergencyContactName: "Contact",
					emergencyContactPhone: "+49123456789",
				})
				.returning("*");

			tourId = tour.id;
		});

		it("löscht Tour erfolgreich", async () => {
			await request(app)
				.delete(`/api/tours/${tourId}`)
				.set("Authorization", `Bearer ${authToken}`)
				.expect(200);

			// Prüfen ob Tour wirklich gelöscht wurde
			const tours = await testDb("tours").where({ id: tourId });
			expect(tours).toHaveLength(0);
		});

		it("verhindert Löschen von Touren anderer Benutzer", async () => {
			// Anderen Benutzer und Tour erstellen
			const [otherUser] = await testDb("users")
				.insert({
					name: "Other User",
					email: "other@example.com",
					password: "$2b$10$hashedpassword",
				})
				.returning("*");

			const [otherTour] = await testDb("tours")
				.insert({
					name: "Other Tour",
					startLocation: "Other Start",
					endLocation: "Other End",
					startTime: "2025-12-10T10:00:00Z",
					expectedEndTime: "2025-12-10T16:00:00Z",
					status: "planned",
					userId: otherUser.id,
					emergencyContactName: "Other Contact",
					emergencyContactPhone: "+49123456791",
				})
				.returning("*");

			await request(app)
				.delete(`/api/tours/${otherTour.id}`)
				.set("Authorization", `Bearer ${authToken}`)
				.expect(404);
		});
	});
});
