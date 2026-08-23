/**
 * ─────────────────────────────────────────────────────────────────────────
 *  API ENDPOINT REGISTRY  —  the single source of truth for the backend map.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Every path & HTTP method the app talks to lives here and NOWHERE else.
 * Services (../services/*) reference these entries by name; pages/hooks
 * reference services. So to point the app at a different backend, a renamed
 * route, or a restructured API, you edit ONLY this file — the service method
 * signatures stay identical, so nothing downstream breaks.
 *
 * The base URL (host + `/v1` prefix) is supplied separately via
 * `VITE_BACKEND_URL`; paths here are relative to it.
 */

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface Endpoint {
	method: HttpMethod;
	path: string;
}

const ep = (method: HttpMethod, path: string): Endpoint => ({ method, path });

export const endpoints = {
	health: {
		ready: ep("GET", "/ready"),
	},
	auth: {
		// Login expects a raw `Authorization: username:password` header (not Basic).
		login: ep("GET", "/login"),
	},
	user: {
		create: ep("POST", "/users/create"),
		getByUsername: ep("POST", "/users/get"),
		current: ep("GET", "/users/user/get"),
	},
	enums: {
		// Query param `enum_name` is appended by the service.
		get: ep("GET", "/enums"),
	},
	timeline: {
		get: ep("GET", "/timeline/user/get"),
	},
	university: {
		list: ep("GET", "/university/user/get"),
		get: ep("POST", "/university/get"),
		create: ep("POST", "/university/create"),
		update: ep("POST", "/university/update"),
		remove: ep("POST", "/university/delete"),
	},
	recommender: {
		list: ep("GET", "/recommenders/user/get"),
		get: ep("POST", "/recommenders/get"),
		create: ep("POST", "/recommenders/create"),
		update: ep("POST", "/recommenders/update"),
		remove: ep("POST", "/recommenders/delete"),
	},
	faculty: {
		list: ep("GET", "/faculties/user/get"),
		listByUniversity: ep("POST", "/faculties/user/university/get"),
		get: ep("POST", "/faculties/get"),
		create: ep("POST", "/faculties/create"),
		update: ep("POST", "/faculties/update"),
		remove: ep("POST", "/faculties/delete"),
	},
	interview: {
		list: ep("GET", "/interviews/user/get"),
		listByFaculty: ep("POST", "/interviews/user/faculty/get"),
		get: ep("POST", "/interviews/get"),
		create: ep("POST", "/interviews/create"),
		update: ep("POST", "/interviews/update"),
		remove: ep("POST", "/interviews/delete"),
	},
	mail: {
		list: ep("GET", "/mails/user/get"),
		listByFaculty: ep("POST", "/mails/user/faculty/get"),
		get: ep("POST", "/mails/get"),
		create: ep("POST", "/mails/create"),
		update: ep("POST", "/mails/update"),
		remove: ep("POST", "/mails/delete"),
	},
	application: {
		list: ep("GET", "/applications/user/get"),
		get: ep("POST", "/applications/get"),
		create: ep("POST", "/applications/create"),
		update: ep("POST", "/applications/update"),
		remove: ep("POST", "/applications/delete"),
	},
	recommendationStatus: {
		listByApplication: ep("POST", "/recommendation_status/university/get"),
		universityName: ep("POST", "/recommendation_status/university/name/get"),
		update: ep("POST", "/recommendation_status/university/update"),
		remove: ep("POST", "/recommendation_status/university/delete"),
	},
} as const;

export type Endpoints = typeof endpoints;
