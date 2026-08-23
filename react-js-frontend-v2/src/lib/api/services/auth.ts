import { callEndpoint } from "../http";
import { endpoints } from "../endpoints";
import type { User } from "@/types";

export interface LoginResult {
	token: string;
}

export interface RegisterInput {
	name: string;
	username: string;
	email: string;
	password: string;
}

export const authService = {
	/**
	 * Log in with the backend's literal `username:password` Authorization header
	 * (NOT HTTP Basic). Returns the JWT on success.
	 */
	login(username: string, password: string) {
		return callEndpoint<LoginResult>(endpoints.auth.login, {
			auth: false,
			rawAuthorization: `${username}:${password}`,
		});
	},

	/** Register a new account. Sends a welcome email server-side. */
	register(input: RegisterInput) {
		return callEndpoint<User>(endpoints.user.create, {
			auth: false,
			body: input,
		});
	},

	/** Fetch the currently authenticated user (via the stored token). */
	currentUser() {
		return callEndpoint<User>(endpoints.user.current);
	},
};
