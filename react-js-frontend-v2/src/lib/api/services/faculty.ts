import { callEndpoint } from "../http";
import { endpoints } from "../endpoints";
import type { Faculty } from "@/types";

export type FacultyInput = Omit<
	Faculty,
	"id" | "user_id" | "created_at" | "updated_at"
>;

export const facultyService = {
	list() {
		return callEndpoint<Faculty[]>(endpoints.faculty.list);
	},
	listByUniversity(university_id: string) {
		return callEndpoint<Faculty[]>(endpoints.faculty.listByUniversity, {
			body: { university_id },
		});
	},
	get(id: string) {
		return callEndpoint<Faculty>(endpoints.faculty.get, { body: { id } });
	},
	create(input: FacultyInput) {
		return callEndpoint<Faculty>(endpoints.faculty.create, { body: input });
	},
	update(input: FacultyInput & { id: string }) {
		return callEndpoint<Faculty>(endpoints.faculty.update, {
			body: { ...input, updated_at: new Date().toISOString() },
		});
	},
	remove(id: string) {
		return callEndpoint<Faculty>(endpoints.faculty.remove, { body: { id } });
	},
};
