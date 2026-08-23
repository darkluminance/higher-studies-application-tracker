import { callEndpoint } from "../http";
import { endpoints } from "../endpoints";
import type { EnumName, TimelineRowRaw, TimelineSummary } from "@/types";

/** Reference data: backend enums and the dashboard timeline aggregate. */
export const referenceService = {
	/** Fetch the string values of a Postgres enum (e.g. application statuses). */
	enum(name: EnumName) {
		return callEndpoint<string[]>(endpoints.enums.get, {
			query: { enum_name: name },
		});
	},

	/** Fetch + parse the dashboard timeline summary. */
	async timeline(): Promise<TimelineSummary> {
		const rows = await callEndpoint<TimelineRowRaw[]>(endpoints.timeline.get);
		const row = rows?.[0];
		if (!row) {
			return {
				events: [],
				appliedUniversityRatio: 0,
				repliedMailsRatio: 0,
				recommendationRatio: 0,
				applicationCount: 0,
			};
		}

		let events: TimelineSummary["events"] = [];
		try {
			events =
				typeof row.Timeline === "string"
					? JSON.parse(row.Timeline)
					: (row.Timeline ?? []);
		} catch {
			events = [];
		}

		return {
			events: events ?? [],
			appliedUniversityRatio: row.Applieduniversitycount ?? 0,
			repliedMailsRatio: row.Repliedmailscount ?? 0,
			recommendationRatio: row.Recommendationcount ?? 0,
			applicationCount: row.Universityapplicationcount ?? 0,
		};
	},
};
