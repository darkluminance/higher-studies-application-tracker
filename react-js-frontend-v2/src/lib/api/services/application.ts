import { callEndpoint } from "../http";
import { endpoints } from "../endpoints";
import type { Application } from "@/types";

export type ApplicationInput = Omit<
	Application,
	"id" | "user_id" | "created_at" | "updated_at"
>;

export const applicationService = {
	list() {
		return callEndpoint<Application[]>(endpoints.application.list);
	},
	get(id: string) {
		return callEndpoint<Application>(endpoints.application.get, {
			body: { id },
		});
	},
	create(input: ApplicationInput) {
		return callEndpoint<Application>(endpoints.application.create, {
			body: input,
		});
	},
	update(input: ApplicationInput & { id: string }) {
		return callEndpoint<Application>(endpoints.application.update, {
			body: { ...input, updated_at: new Date().toISOString() },
		});
	},
	remove(id: string) {
		return callEndpoint<Application>(endpoints.application.remove, {
			body: { id },
		});
	},
};
