import { callEndpoint } from "../http";
import { endpoints } from "../endpoints";
import type { Recommender } from "@/types";

export type RecommenderInput = Omit<
	Recommender,
	"id" | "user_id" | "created_at" | "updated_at"
>;

export const recommenderService = {
	list() {
		return callEndpoint<Recommender[]>(endpoints.recommender.list);
	},
	get(id: string) {
		return callEndpoint<Recommender>(endpoints.recommender.get, {
			body: { id },
		});
	},
	create(input: RecommenderInput) {
		return callEndpoint<Recommender>(endpoints.recommender.create, {
			body: input,
		});
	},
	update(input: RecommenderInput & { id: string }) {
		return callEndpoint<Recommender>(endpoints.recommender.update, {
			body: { ...input, updated_at: new Date().toISOString() },
		});
	},
	remove(id: string) {
		return callEndpoint<Recommender>(endpoints.recommender.remove, {
			body: { id },
		});
	},
};
