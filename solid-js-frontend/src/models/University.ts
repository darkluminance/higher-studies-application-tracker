export type Universities = {
	id: string;
	user_id?: string;
	name: string;
	website: string;
	location: string;
	main_ranking: number | null;
	subject_ranking: number | null;
	application_deadline: string;
	early_deadline: string;
	is_gre_must: boolean | string;
	is_gmat_must: boolean | string;
	lor_count: number;
	is_official_transcript_required: boolean | string;
	is_transcript_needs_evaluation: boolean | string;
	accepted_evaluations: string[];
	created_at?: Date;
	updated_at?: Date;
};
