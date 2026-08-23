import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/utils";

// All fixture data lives inside the factory (vi.mock is hoisted).
vi.mock("@/features/queries", () => {
	const list = (data: unknown[]) => ({
		data,
		isLoading: false,
		isError: false,
		refetch: () => {},
	});
	const mutations = {
		useCreate: () => ({ mutateAsync: async () => {}, isPending: false }),
		useUpdate: () => ({ mutateAsync: async () => {}, isPending: false }),
		useRemove: () => ({ mutate: () => {} }),
	};
	const university = {
		id: "u1",
		name: "ETH",
		location: "Zürich",
		lor_count: 3,
		application_deadline: "2025-12-15T00:00:00Z",
		main_ranking: 7,
		application_fee: 150,
		early_deadline: "2025-12-01T00:00:00Z",
		is_gre_must: false,
		is_gmat_must: false,
		is_official_transcript_required: false,
		is_transcript_needs_evaluation: false,
		accepted_evaluations: [],
		remarks: "",
		website: "",
	};
	const faculty = {
		id: "f1",
		name: "Prof Silva",
		email: "s@x.io",
		university_id: "u1",
		designation: "Professor",
		research_areas: ["Robotics"],
		interested_papers: [],
	};
	return {
		universities: { useList: () => list([university]), ...mutations },
		faculties: { useList: () => list([faculty]), ...mutations },
		recommenders: {
			useList: () =>
				list([
					{
						id: "rec1",
						name: "Dr Demir",
						email: "demir@x.io",
						designation: "Advisor",
						institution: "Boğaziçi",
						relationship: "Thesis advisor",
					},
				]),
			...mutations,
		},
		mails: {
			useList: () =>
				list([
					{
						id: "m1",
						faculty_id: "f1",
						faculty_name: "Prof Silva",
						is_mailed: true,
						is_mail_replied: false,
						reply_vibe: "Warm",
						is_interview_requested: true,
						remarks: "",
					},
				]),
			...mutations,
		},
		interviews: {
			useList: () =>
				list([
					{ id: "i1", faculty_id: "f1", date: "2025-11-28T00:00:00Z", time: "3:00 PM", is_completed: false, remarks: "" },
					{ id: "i2", faculty_id: "f1", date: "2025-11-12T00:00:00Z", time: "2:00 PM", is_completed: true, remarks: "Went well" },
				]),
			...mutations,
		},
		applications: {
			useList: () =>
				list([
					{
						id: "a1",
						university_id: "u1",
						application_type: "MS",
						application_status: "Submitted",
						recommenders_id: ["r1", "r2", "r3"],
						shortlisted_faculties_id: [],
						language_score_submitted: false,
						gre_submitted: false,
						gmat_submitted: false,
						remarks: "",
					},
				]),
			...mutations,
		},
		useEnum: () => ({ data: [] }),
		useTimeline: () => list([]),
		useFacultiesByUniversity: () => ({ data: [faculty] }),
	};
});

import { FacultyPage } from "./faculty/FacultyPage";
import { MailPage } from "./mail/MailPage";
import { InterviewPage } from "./interview/InterviewPage";
import { ApplicationPage } from "./application/ApplicationPage";
import { RecommenderPage } from "./recommender/RecommenderPage";

describe("pages render domain data", () => {
	it("FacultyPage shows the faculty, role·university and research tags", () => {
		renderWithProviders(<FacultyPage />);
		expect(screen.getByText("Prof Silva")).toBeInTheDocument();
		expect(screen.getByText("Professor · ETH")).toBeInTheDocument();
		expect(screen.getByText("Robotics")).toBeInTheDocument();
	});

	it("MailPage shows the vibe pill and Invited status", () => {
		renderWithProviders(<MailPage />);
		expect(screen.getAllByText("Warm").length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText("Invited").length).toBeGreaterThanOrEqual(1);
	});

	it("InterviewPage groups upcoming and done with the right pills", () => {
		renderWithProviders(<InterviewPage />);
		// "Upcoming" appears as both a section header and a status pill.
		expect(screen.getAllByText("Upcoming").length).toBeGreaterThanOrEqual(1);
		expect(screen.getByText("Done")).toBeInTheDocument();
		expect(screen.getByText("Completed")).toBeInTheDocument();
	});

	it("ApplicationPage shows status and recommender progress", () => {
		renderWithProviders(<ApplicationPage />);
		expect(screen.getAllByText("Submitted").length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText("3 of 3").length).toBeGreaterThanOrEqual(1);
	});

	it("RecommenderPage shows the recommender card with email and relationship", () => {
		renderWithProviders(<RecommenderPage />);
		expect(screen.getByText("Dr Demir")).toBeInTheDocument();
		expect(screen.getByText("demir@x.io")).toBeInTheDocument();
		expect(screen.getByText("Thesis advisor")).toBeInTheDocument();
	});
});
