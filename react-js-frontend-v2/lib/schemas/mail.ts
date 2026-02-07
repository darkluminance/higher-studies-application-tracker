import { z } from "zod";

export const mailSchema = z.object({
  faculty_id: z.string().min(1, "Faculty is required"),
  is_mailed: z.boolean().default(false),
  is_mail_replied: z.boolean().default(false),
  reply_vibe: z.string().optional(),
  is_interview_requested: z.boolean().default(false),
  remarks: z.string().optional(),
});

export type MailFormData = z.infer<typeof mailSchema>;

export const mailDefaults: MailFormData = {
  faculty_id: "",
  is_mailed: false,
  is_mail_replied: false,
  reply_vibe: "",
  is_interview_requested: false,
  remarks: "",
};
