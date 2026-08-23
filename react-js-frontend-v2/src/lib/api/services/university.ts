import { callEndpoint } from "../http";
import { endpoints } from "../endpoints";
import type { University } from "@/types";

export type UniversityInput = Omit<
	University,
	"id" | "user_id" | "created_at" | "updated_at"
>;

export const universityService = {
	list() {
		return callEndpoint<University[]>(endpoints.university.list);
	},
	get(id: string) {
		return callEndpoint<University>(endpoints.university.get, { body: { id } });
	},
	create(input: UniversityInput) {
		return callEndpoint<University>(endpoints.university.create, {
			body: input,
		});
	},
	update(input: UniversityInput & { id: string }) {
		return callEndpoint<University>(endpoints.university.update, {
			body: { ...input, updated_at: new Date().toISOString() },
		});
	},
	remove(id: string) {
		return callEndpoint<University>(endpoints.university.remove, {
			body: { id },
		});
	},
};
