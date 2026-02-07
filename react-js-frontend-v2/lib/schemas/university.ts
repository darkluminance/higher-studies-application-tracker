import { z } from "zod";

export const universitySchema = z.object({
  name: z.string().min(1, "University name is required"),
  website: z.string().url("Invalid URL format").optional().or(z.literal("")),
  location: z.string().optional(),
  main_ranking: z.coerce.number().nullable().optional(),
  application_fee: z.coerce.number().min(0, "Fee must be positive").default(0),
  application_deadline: z.string().optional(),
  early_deadline: z.string().optional(),
  is_gre_must: z.boolean().default(false),
  is_gmat_must: z.boolean().default(false),
  lor_count: z.coerce.number().min(0, "LOR count must be positive").default(0),
  is_official_transcript_required: z.boolean().default(false),
  is_transcript_needs_evaluation: z.boolean().default(false),
  accepted_evaluations: z.array(z.string()).default([]),
  remarks: z.string().optional(),
});

export type UniversityFormData = z.infer<typeof universitySchema>;

export const universityDefaults: UniversityFormData = {
  name: "",
  website: "",
  location: "",
  main_ranking: null,
  application_fee: 0,
  application_deadline: "",
  early_deadline: "",
  is_gre_must: false,
  is_gmat_must: false,
  lor_count: 0,
  is_official_transcript_required: false,
  is_transcript_needs_evaluation: false,
  accepted_evaluations: [],
  remarks: "",
};
