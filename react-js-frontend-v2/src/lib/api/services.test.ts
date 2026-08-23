import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the low-level client so we can assert which endpoint each service hits.
vi.mock("./http", () => ({
	callEndpoint: vi.fn(() => Promise.resolve(undefined)),
}));

import { callEndpoint } from "./http";
import { endpoints } from "./endpoints";
import { authService } from "./services/auth";
import { referenceService } from "./services/reference";
import { universityService } from "./services/university";
import { facultyService } from "./services/faculty";
import { interviewService } from "./services/interview";
import { mailService } from "./services/mail";
import { applicationService } from "./services/application";
import { recommenderService } from "./services/recommender";
import { recommendationStatusService } from "./services/recommendationStatus";

const mockCall = vi.mocked(callEndpoint);

beforeEach(() => {
	mockCall.mockClear();
	mockCall.mockResolvedValue(undefined);
});

describe("authService", () => {
	it("login sends a raw username:password header and no bearer", () => {
		authService.login("alice", "secret");
		expect(mockCall).toHaveBeenCalledWith(endpoints.auth.login, {
			auth: false,
			rawAuthorization: "alice:secret",
		});
	});

	it("register posts to users/create without auth", () => {
		const input = { name: "A", username: "a", email: "a@x.io", password: "p" };
		authService.register(input);
		expect(mockCall).toHaveBeenCalledWith(endpoints.user.create, {
			auth: false,
			body: input,
		});
	});

	it("currentUser hits users/user/get", () => {
		authService.currentUser();
		expect(mockCall).toHaveBeenCalledWith(endpoints.user.current);
	});
});

describe("referenceService", () => {
	it("enum passes the enum_name query", () => {
		referenceService.enum("reply_vibe_enum");
		expect(mockCall).toHaveBeenCalledWith(endpoints.enums.get, {
			query: { enum_name: "reply_vibe_enum" },
		});
	});

	it("timeline parses the Timeline JSON string and ratios", async () => {
		mockCall.mockResolvedValueOnce([
			{
				Timeline: JSON.stringify([{ type: "University", name: "ETH", date: "2025-12-01" }]),
				Applieduniversitycount: 0.6,
				Repliedmailscount: 0.4,
				Recommendationcount: 0.75,
				Universityapplicationcount: 3,
			},
		]);
		const summary = await referenceService.timeline();
		expect(summary.events).toEqual([
			{ type: "University", name: "ETH", date: "2025-12-01" },
		]);
		expect(summary.appliedUniversityRatio).toBe(0.6);
		expect(summary.repliedMailsRatio).toBe(0.4);
		expect(summary.recommendationRatio).toBe(0.75);
		expect(summary.applicationCount).toBe(3);
	});

	it("timeline returns an empty summary when there are no rows", async () => {
		mockCall.mockResolvedValueOnce([]);
		const summary = await referenceService.timeline();
		expect(summary.events).toEqual([]);
		expect(summary.applicationCount).toBe(0);
	});

	it("timeline tolerates malformed Timeline JSON", async () => {
		mockCall.mockResolvedValueOnce([
			{
				Timeline: "{not json",
				Applieduniversitycount: 0,
				Repliedmailscount: 0,
				Recommendationcount: 0,
				Universityapplicationcount: 0,
			},
		]);
		const summary = await referenceService.timeline();
		expect(summary.events).toEqual([]);
	});
});

describe("universityService", () => {
	it("list / get / remove map to the right endpoints", () => {
		universityService.list();
		expect(mockCall).toHaveBeenLastCalledWith(endpoints.university.list);

		universityService.get("u1");
		expect(mockCall).toHaveBeenLastCalledWith(endpoints.university.get, {
			body: { id: "u1" },
		});

		universityService.remove("u1");
		expect(mockCall).toHaveBeenLastCalledWith(endpoints.university.remove, {
			body: { id: "u1" },
		});
	});

	it("create posts the input body", () => {
		const input = { name: "ETH" } as never;
		universityService.create(input);
		expect(mockCall).toHaveBeenCalledWith(endpoints.university.create, {
			body: input,
		});
	});

	it("update includes id and an updated_at timestamp", () => {
		universityService.update({ id: "u1", name: "ETH" } as never);
		expect(mockCall).toHaveBeenCalledWith(
			endpoints.university.update,
			expect.objectContaining({
				body: expect.objectContaining({
					id: "u1",
					name: "ETH",
					updated_at: expect.any(String),
				}),
			})
		);
	});
});

describe("faculty & related list-by helpers", () => {
	it("facultyService.listByUniversity passes university_id", () => {
		facultyService.listByUniversity("u9");
		expect(mockCall).toHaveBeenCalledWith(endpoints.faculty.listByUniversity, {
			body: { university_id: "u9" },
		});
	});

	it("interviewService.listByFaculty passes faculty_id", () => {
		interviewService.listByFaculty("f2");
		expect(mockCall).toHaveBeenCalledWith(endpoints.interview.listByFaculty, {
			body: { faculty_id: "f2" },
		});
	});

	it("mailService.listByFaculty passes faculty_id", () => {
		mailService.listByFaculty("f3");
		expect(mockCall).toHaveBeenCalledWith(endpoints.mail.listByFaculty, {
			body: { faculty_id: "f3" },
		});
	});
});

describe("applicationService", () => {
	it("list and create map correctly", () => {
		applicationService.list();
		expect(mockCall).toHaveBeenLastCalledWith(endpoints.application.list);
		applicationService.create({ university_id: "u1" } as never);
		expect(mockCall).toHaveBeenLastCalledWith(endpoints.application.create, {
			body: { university_id: "u1" },
		});
	});
});

describe("recommenderService", () => {
	it("create maps correctly", () => {
		recommenderService.create({ name: "Dr X" } as never);
		expect(mockCall).toHaveBeenCalledWith(endpoints.recommender.create, {
			body: { name: "Dr X" },
		});
	});
});

describe("recommendationStatusService", () => {
	it("listByApplication passes application_id", () => {
		recommendationStatusService.listByApplication("a1");
		expect(mockCall).toHaveBeenCalledWith(
			endpoints.recommendationStatus.listByApplication,
			{ body: { application_id: "a1" } }
		);
	});

	it("universityName passes application_id", () => {
		recommendationStatusService.universityName("a1");
		expect(mockCall).toHaveBeenCalledWith(
			endpoints.recommendationStatus.universityName,
			{ body: { application_id: "a1" } }
		);
	});

	it("setSubmitted posts id + is_lor_submitted", () => {
		recommendationStatusService.setSubmitted("r1", true);
		expect(mockCall).toHaveBeenCalledWith(endpoints.recommendationStatus.update, {
			body: { id: "r1", is_lor_submitted: true },
		});
	});

	it("remove posts the id", () => {
		recommendationStatusService.remove("r1");
		expect(mockCall).toHaveBeenCalledWith(endpoints.recommendationStatus.remove, {
			body: { id: "r1" },
		});
	});
});

// Exercise the complete CRUD surface of every standard entity service so each
// method maps to its endpoint (list / get / create / update / remove).
describe("full CRUD surface for standard entities", () => {
	const entities = [
		{ svc: universityService, ep: endpoints.university },
		{ svc: recommenderService, ep: endpoints.recommender },
		{ svc: facultyService, ep: endpoints.faculty },
		{ svc: interviewService, ep: endpoints.interview },
		{ svc: mailService, ep: endpoints.mail },
		{ svc: applicationService, ep: endpoints.application },
	] as const;

	for (const { svc, ep } of entities) {
		it(`${ep.list.path} maps list/get/create/update/remove`, () => {
			svc.list();
			expect(mockCall).toHaveBeenLastCalledWith(ep.list);

			svc.get("id1");
			expect(mockCall).toHaveBeenLastCalledWith(ep.get, { body: { id: "id1" } });

			svc.create({ any: "thing" } as never);
			expect(mockCall).toHaveBeenLastCalledWith(ep.create, {
				body: { any: "thing" },
			});

			svc.update({ id: "id1", any: "thing" } as never);
			expect(mockCall).toHaveBeenLastCalledWith(
				ep.update,
				expect.objectContaining({
					body: expect.objectContaining({ id: "id1", updated_at: expect.any(String) }),
				})
			);

			svc.remove("id1");
			expect(mockCall).toHaveBeenLastCalledWith(ep.remove, { body: { id: "id1" } });
		});
	}
});
