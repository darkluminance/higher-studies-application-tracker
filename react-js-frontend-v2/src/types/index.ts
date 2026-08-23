/**
 * Domain types mirroring the Go backend DTOs (see go-server/models.go and the
 * legacy solid-js-frontend/src/models/*). Boolean-ish fields can arrive from the
 * API as a real boolean or the string "YES"/"NO" — use `isYes()` to normalize.
 */

export type Flag = boolean | string;

export const isYes = (v: Flag | undefined | null): boolean =>
	v === true || v === "YES" || v === "yes" || v === "true";

export interface User {
	id: string;
	name: string;
	username: string;
	email: string;
	created_at?: string;
	updated_at?: string;
}

export interface University {
	id: string;
	user_id?: string;
	name: string;
	website: string;
	location: string;
	main_ranking: number | null;
	application_fee: number;
	application_deadline: string;
	early_deadline: string;
	is_gre_must: Flag;
	is_gmat_must: Flag;
	lor_count: number;
	is_official_transcript_required: Flag;
	is_transcript_needs_evaluation: Flag;
	accepted_evaluations: string[];
	remarks: string;
	created_at?: string;
	updated_at?: string;
}

export interface Recommender {
	id: string;
	user_id?: string;
	name: string;
	email: string;
	designation: string;
	institution: string;
	relationship: string;
	created_at?: string;
	updated_at?: string;
}

export interface Faculty {
	id: string;
	user_id?: string;
	name: string;
	email: string;
	university_id: string;
	designation: string;
	research_areas: string[];
	interested_papers: string[];
	created_at?: string;
	updated_at?: string;
}

export interface Interview {
	id: string;
	user_id?: string;
	faculty_id: string;
	date: string;
	time: string;
	is_completed: Flag;
	remarks: string;
	created_at?: string;
	updated_at?: string;
}

export interface Mail {
	id: string;
	user_id?: string;
	faculty_id: string;
	faculty_name?: string;
	is_mailed: Flag;
	is_mail_replied: Flag;
	reply_vibe: string;
	is_interview_requested: Flag;
	remarks: string;
	created_at?: string;
	updated_at?: string;
}

export interface Application {
	id: string;
	user_id?: string;
	university_id: string;
	application_type: string;
	shortlisted_faculties_id: string[];
	recommenders_id: string[];
	application_status: string;
	language_score_submitted: Flag;
	gre_submitted: Flag;
	gmat_submitted: Flag;
	remarks: string;
	created_at?: string;
	updated_at?: string;
}

export interface RecommendationStatus {
	id: string;
	name: string;
	application_id: string;
	recommender_id: string;
	is_lor_submitted: Flag;
}

export interface TimelineEvent {
	type: string; // "University" (deadline) | otherwise interview
	name: string;
	designation?: string;
	university_name?: string;
	date: string;
}

/** Raw timeline row as returned by GET /timeline/user/get (Timeline is a JSON string). */
export interface TimelineRowRaw {
	Timeline: string;
	Applieduniversitycount: number;
	Repliedmailscount: number;
	Universityapplicationcount: number;
	Recommendationcount: number;
}

/** Parsed timeline summary consumed by the dashboard. */
export interface TimelineSummary {
	events: TimelineEvent[];
	appliedUniversityRatio: number;
	repliedMailsRatio: number;
	recommendationRatio: number;
	applicationCount: number;
}

/** Enum names exposed by GET /enums?enum_name=… */
export type EnumName =
	| "application_type_enum"
	| "university_application_status_enum"
	| "reply_vibe_enum";
