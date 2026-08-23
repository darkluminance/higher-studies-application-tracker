import { useQuery } from "@tanstack/react-query";
import { createCrudHooks } from "@/lib/crud";
import {
	universityService,
	facultyService,
	recommenderService,
	interviewService,
	mailService,
	applicationService,
	referenceService,
} from "@/lib/api";
import type { EnumName } from "@/types";

/* ── Entity CRUD hooks (list / create / update / remove) ───────────────── */

export const universities = createCrudHooks({
	key: "universities",
	service: universityService,
	labels: {
		created: "University added",
		updated: "University updated",
		deleted: "University removed",
	},
});

export const recommenders = createCrudHooks({
	key: "recommenders",
	service: recommenderService,
	labels: {
		created: "Recommender added",
		updated: "Recommender updated",
		deleted: "Recommender removed",
	},
});

export const faculties = createCrudHooks({
	key: "faculties",
	service: facultyService,
	labels: {
		created: "Faculty added",
		updated: "Faculty updated",
		deleted: "Faculty removed",
	},
});

export const interviews = createCrudHooks({
	key: "interviews",
	service: interviewService,
	labels: {
		created: "Interview added",
		updated: "Interview updated",
		deleted: "Interview removed",
	},
});

export const mails = createCrudHooks({
	key: "mails",
	service: mailService,
	labels: {
		created: "Email logged",
		updated: "Email updated",
		deleted: "Email removed",
	},
});

export const applications = createCrudHooks({
	key: "applications",
	service: applicationService,
	labels: {
		created: "Application added",
		updated: "Application updated",
		deleted: "Application removed",
	},
});

/* ── Reference data hooks ──────────────────────────────────────────────── */

export function useEnum(name: EnumName) {
	return useQuery({
		queryKey: ["enum", name],
		queryFn: () => referenceService.enum(name),
		staleTime: 1000 * 60 * 30,
	});
}

export function useTimeline() {
	return useQuery({
		queryKey: ["timeline"],
		queryFn: () => referenceService.timeline(),
	});
}

export function useFacultiesByUniversity(universityId: string | undefined) {
	return useQuery({
		queryKey: ["faculties", "by-university", universityId],
		queryFn: () => facultyService.listByUniversity(universityId as string),
		enabled: Boolean(universityId),
	});
}
