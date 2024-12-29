export type Mails = {
	id: string;
	user_id?: string;
	faculty_id: string;
	faculty_name: string;
	is_mailed: boolean | string;
	is_mail_replied: boolean | string;
	reply_vibe: string;
	is_interview_requested: boolean | string;
	remarks: string;
	created_at?: Date;
	updated_at?: Date;
};
