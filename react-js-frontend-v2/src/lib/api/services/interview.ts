import { callEndpoint } from "../http";
import { endpoints } from "../endpoints";
import type { Interview } from "@/types";

export type InterviewInput = Omit<
	Interview,
	"id" | "user_id" | "created_at" | "updated_at"
>;

export const interviewService = {
	list() {
		return callEndpoint<Interview[]>(endpoints.interview.list);
	},
	listByFaculty(faculty_id: string) {
		return callEndpoint<Interview[]>(endpoints.interview.listByFaculty, {
			body: { faculty_id },
		});
	},
	get(id: string) {
		return callEndpoint<Interview>(endpoints.interview.get, { body: { id } });
	},
	create(input: InterviewInput) {
		return callEndpoint<Interview>(endpoints.interview.create, { body: input });
	},
	update(input: InterviewInput & { id: string }) {
		return callEndpoint<Interview>(endpoints.interview.update, {
			body: { ...input, updated_at: new Date().toISOString() },
		});
	},
	remove(id: string) {
		return callEndpoint<Interview>(endpoints.interview.remove, { body: { id } });
	},
};
