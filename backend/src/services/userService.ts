import { db } from "../config/database";
import { User } from "../types";
import { v4 as uuidv4 } from "uuid";

export class UserService {
	async createUser(userData: {
		email: string;
		name: string;
		phone?: string;
		passwordHash: string;
	}): Promise<User> {
		const user = {
			id: uuidv4(),
			...userData,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		await db("users").insert({
			id: user.id,
			email: user.email,
			name: user.name,
			phone: user.phone,
			password_hash: user.passwordHash,
			created_at: user.createdAt,
			updated_at: user.updatedAt,
		});

		return user as User;
	}

	async findByEmail(email: string): Promise<User | null> {
		const userData = await db("users").where({ email }).first();
		if (!userData) return null;

		return this.mapDbToUser(userData);
	}

	async findById(id: string): Promise<User | null> {
		const userData = await db("users").where({ id }).first();
		if (!userData) return null;

		return this.mapDbToUser(userData);
	}

	async updateUser(
		id: string,
		updateData: Partial<User>
	): Promise<User | null> {
		const user = await this.findById(id);
		if (!user) return null;

		const updatedUser = {
			...user,
			...updateData,
			updatedAt: new Date(),
		};

		await db("users").where({ id }).update({
			name: updatedUser.name,
			phone: updatedUser.phone,
			updated_at: updatedUser.updatedAt,
		});

		return updatedUser;
	}

	private mapDbToUser(dbUser: any): User {
		return {
			id: dbUser.id,
			email: dbUser.email,
			name: dbUser.name,
			phone: dbUser.phone,
			passwordHash: dbUser.password_hash,
			createdAt: dbUser.created_at,
			updatedAt: dbUser.updated_at,
		};
	}
}

export const userService = new UserService();
