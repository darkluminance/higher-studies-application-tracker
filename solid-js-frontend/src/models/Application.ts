export type Applications = {
	id: string;
	user_id?: string;
	university_id: string;
	shortlisted_faculties_id: string[];
	recommenders_id: string[];
	application_status: string;
	language_score_submitted: boolean | string;
	gre_submitted: boolean | string;
	gmat_submitted: boolean | string;
	created_at?: Date;
	updated_at?: Date;
};
