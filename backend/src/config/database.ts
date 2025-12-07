import knex from "knex";

const config = {
	client: "pg",
	connection: {
		host: process.env.DB_HOST || "localhost",
		port: parseInt(process.env.DB_PORT || "5432"),
		user: process.env.DB_USER || "tourguard",
		password: process.env.DB_PASSWORD || "tourguard_password",
		database: process.env.DB_NAME || "tourguard",
	},
	migrations: {
		tableName: "knex_migrations",
		directory: "./src/migrations",
	},
	seeds: {
		directory: "./src/seeds",
	},
};

export const db = knex(config);

export async function setupDatabase() {
	try {
		// Test database connection
		await db.raw("SELECT NOW()");

		console.log("Database setup completed");
		return true;
	} catch (error) {
		console.error("Database setup failed:", error);
		throw error;
	}
}
