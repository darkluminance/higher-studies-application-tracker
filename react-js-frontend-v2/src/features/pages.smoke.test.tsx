import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/utils";

// NOTE: everything the factory needs is defined INSIDE it — vi.mock is hoisted
// above module-level variables, so referencing outer consts would throw.
vi.mock("@/features/queries", () => {
	const emptyList = {
		data: [],
		isLoading: false,
		isError: false,
		refetch: () => {},
	};
	const crud = {
		useList: () => emptyList,
		useRemove: () => ({ mutate: () => {} }),
		useCreate: () => ({ mutateAsync: async () => {}, isPending: false }),
		useUpdate: () => ({ mutateAsync: async () => {}, isPending: false }),
	};
	return {
		universities: crud,
		recommenders: crud,
		faculties: crud,
		interviews: crud,
		mails: crud,
		applications: crud,
		useEnum: () => ({ data: [] }),
		useTimeline: () => ({
			data: undefined,
			isLoading: false,
			isError: false,
			refetch: () => {},
		}),
		useFacultiesByUniversity: () => ({ data: [] }),
	};
});

import { ApplicationPage } from "./application/ApplicationPage";
import { FacultyPage } from "./faculty/FacultyPage";
import { MailPage } from "./mail/MailPage";
import { InterviewPage } from "./interview/InterviewPage";
import { RecommenderPage } from "./recommender/RecommenderPage";

describe("list pages — empty states", () => {
	it("ApplicationPage renders its header and empty state", () => {
		renderWithProviders(<ApplicationPage />);
		expect(screen.getByRole("heading", { name: "Applications" })).toBeInTheDocument();
		expect(screen.getByText("No applications yet")).toBeInTheDocument();
	});

	it("FacultyPage renders its empty state", () => {
		renderWithProviders(<FacultyPage />);
		expect(screen.getByText("No faculties yet")).toBeInTheDocument();
	});

	it("MailPage renders its empty state", () => {
		renderWithProviders(<MailPage />);
		expect(screen.getByText("No emails logged yet")).toBeInTheDocument();
	});

	it("InterviewPage renders its empty state", () => {
		renderWithProviders(<InterviewPage />);
		expect(screen.getByText("No interviews yet")).toBeInTheDocument();
	});

	it("RecommenderPage renders its empty state", () => {
		renderWithProviders(<RecommenderPage />);
		expect(screen.getByText("No recommenders yet")).toBeInTheDocument();
	});
});
