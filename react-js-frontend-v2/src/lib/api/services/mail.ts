import { callEndpoint } from "../http";
import { endpoints } from "../endpoints";
import type { Mail } from "@/types";

export type MailInput = Omit<
	Mail,
	"id" | "user_id" | "created_at" | "updated_at"
>;

export const mailService = {
	list() {
		return callEndpoint<Mail[]>(endpoints.mail.list);
	},
	listByFaculty(faculty_id: string) {
		return callEndpoint<Mail[]>(endpoints.mail.listByFaculty, {
			body: { faculty_id },
		});
	},
	get(id: string) {
		return callEndpoint<Mail>(endpoints.mail.get, { body: { id } });
	},
	create(input: MailInput) {
		return callEndpoint<Mail>(endpoints.mail.create, { body: input });
	},
	update(input: MailInput & { id: string }) {
		return callEndpoint<Mail>(endpoints.mail.update, {
			body: { ...input, updated_at: new Date().toISOString() },
		});
	},
	remove(id: string) {
		return callEndpoint<Mail>(endpoints.mail.remove, { body: { id } });
	},
};
