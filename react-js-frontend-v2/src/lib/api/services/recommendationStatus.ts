import { callEndpoint } from "../http";
import { endpoints } from "../endpoints";
import type { RecommendationStatus } from "@/types";

/** Per-application recommendation-letter tracking (one row per recommender). */
export const recommendationStatusService = {
	listByApplication(application_id: string) {
		return callEndpoint<RecommendationStatus[]>(
			endpoints.recommendationStatus.listByApplication,
			{ body: { application_id } }
		);
	},
	universityName(application_id: string) {
		return callEndpoint<string>(endpoints.recommendationStatus.universityName, {
			body: { application_id },
		});
	},
	setSubmitted(id: string, is_lor_submitted: boolean) {
		return callEndpoint<RecommendationStatus>(
			endpoints.recommendationStatus.update,
			{ body: { id, is_lor_submitted } }
		);
	},
	remove(id: string) {
		return callEndpoint<RecommendationStatus>(
			endpoints.recommendationStatus.remove,
			{ body: { id } }
		);
	},
};
