/**
 * Public API surface. Pages & hooks import services from here — never raw paths.
 * Swap endpoints in ./endpoints.ts and everything below keeps working.
 */
export { http, callEndpoint, configureHttp, ApiError, HttpStatus } from "./http";
export { endpoints } from "./endpoints";
export type { Endpoint, HttpMethod } from "./endpoints";

export { authService } from "./services/auth";
export type { LoginResult, RegisterInput } from "./services/auth";
export { referenceService } from "./services/reference";
export { universityService } from "./services/university";
export type { UniversityInput } from "./services/university";
export { recommenderService } from "./services/recommender";
export type { RecommenderInput } from "./services/recommender";
export { facultyService } from "./services/faculty";
export type { FacultyInput } from "./services/faculty";
export { interviewService } from "./services/interview";
export type { InterviewInput } from "./services/interview";
export { mailService } from "./services/mail";
export type { MailInput } from "./services/mail";
export { applicationService } from "./services/application";
export type { ApplicationInput } from "./services/application";
export { recommendationStatusService } from "./services/recommendationStatus";
