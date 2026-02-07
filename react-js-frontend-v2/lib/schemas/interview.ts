import { z } from "zod";

export const interviewSchema = z.object({
  faculty_id: z.string().min(1, "Faculty is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  is_completed: z.boolean().default(false),
  remarks: z.string().optional(),
});

export type InterviewFormData = z.infer<typeof interviewSchema>;

export const interviewDefaults: InterviewFormData = {
  faculty_id: "",
  date: "",
  time: "",
  is_completed: false,
  remarks: "",
};
