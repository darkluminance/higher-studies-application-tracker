export type Faculties = {
	id: string;
	user_id?: string;
	name: string;
	email: string;
	university_id: string;
	designation: string;
	research_areas: string[];
	interested_papers: string[];
	created_at?: Date;
	updated_at?: Date;
};
