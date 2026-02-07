import { z } from "zod";

export const facultySchema = z.object({
  name: z.string().min(1, "Faculty name is required"),
  email: z.string().email("Invalid email address"),
  university_id: z.string().min(1, "University is required"),
  designation: z.string().optional(),
  research_areas: z.array(z.string()).default([]),
  interested_papers: z.array(z.string()).default([]),
});

export type FacultyFormData = z.infer<typeof facultySchema>;

export const facultyDefaults: FacultyFormData = {
  name: "",
  email: "",
  university_id: "",
  designation: "",
  research_areas: [],
  interested_papers: [],
};
