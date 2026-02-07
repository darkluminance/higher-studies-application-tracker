// TrackGrad Data Types

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
  is_gre_must: boolean;
  is_gmat_must: boolean;
  lor_count: number;
  is_official_transcript_required: boolean;
  is_transcript_needs_evaluation: boolean;
  accepted_evaluations: string[];
  remarks: string;
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

export interface Interview {
  id: string;
  user_id?: string;
  faculty_id: string;
  date: string;
  time: string;
  is_completed: boolean;
  remarks: string;
  created_at?: string;
  updated_at?: string;
}

export interface Mail {
  id: string;
  user_id?: string;
  faculty_id: string;
  faculty_name: string;
  is_mailed: boolean;
  is_mail_replied: boolean;
  reply_vibe: string;
  is_interview_requested: boolean;
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
  language_score_submitted: boolean;
  gre_submitted: boolean;
  gmat_submitted: boolean;
  remarks: string;
  created_at?: string;
  updated_at?: string;
}

export interface RecommenderStatus {
  id: string;
  name: string;
  application_id: string;
  recommender_id: string;
  is_lor_submitted: boolean;
}

export interface TimelineEvent {
  type: "University" | "Interview";
  name: string;
  designation?: string;
  university_name?: string;
  date: string;
}

export interface UpcomingEvent {
  type: "deadline" | "interview";
  title: string;
  designation?: string;
  university?: string;
  date: string;
  daysLeft: number;
  status: "urgent" | "upcoming" | "normal";
}

export interface DashboardData {
  Timeline: TimelineEvent[];
  Applieduniversitycount: number;
  Repliedmailscount: number;
  Universityapplicationcount: number;
  Recommendationcount: number;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
}

// Enums - matches backend exactly
export enum ApplicationType {
  PHD = "PHD",
  MASTERS = "MASTERS",
}

export enum ApplicationStatus {
  NOT_APPLIED = "NOT APPLIED",
  SKIPPED = "SKIPPED",
  IN_PROGRESS = "IN PROGRESS",
  PENDING_FEE = "PENDING FEE",
  APPLIED = "APPLIED",
  REJECTED = "REJECTED",
  ACCEPTED_WITH_FUND = "ACCEPTED WITH FUND",
  ACCEPTED_WITHOUT_FULL_FUND = "ACCEPTED WITHOUT FULL FUND",
}

export enum ReplyVibe {
  ENTHUSIASTIC = "ENTHUSIASTIC",
  GENERIC = "GENERIC",
}

export enum TimelineEventType {
  DEADLINE = "DEADLINE",
  INTERVIEW = "INTERVIEW",
}

// For backwards compatibility with existing code using string literals
export type ApplicationTypeValue = `${ApplicationType}`;
export type ApplicationStatusValue = `${ApplicationStatus}`;
export type ReplyVibeValue = `${ReplyVibe}`;
