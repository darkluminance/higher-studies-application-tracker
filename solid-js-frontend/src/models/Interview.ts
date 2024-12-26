export type Interviews = {
	id: string;
	user_id?: string;
	faculty_id: string;
	date: string;
	is_completed: boolean | string;
	remarks: string;
	created_at?: Date;
	updated_at?: Date;
};
