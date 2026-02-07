import { z } from "zod";
import { ApplicationStatus, ApplicationType } from "@/lib/types";

export const applicationSchema = z.object({
  university_id: z.string().min(1, "University is required"),
  application_type: z.nativeEnum(ApplicationType, {
    message: "Application type is required",
  }),
  application_status: z.nativeEnum(ApplicationStatus).default(ApplicationStatus.NOT_APPLIED),
  shortlisted_faculties_id: z.array(z.string()).default([]),
  recommenders_id: z.array(z.string()).default([]),
  language_score_submitted: z.boolean().default(false),
  gre_submitted: z.boolean().default(false),
  gmat_submitted: z.boolean().default(false),
  remarks: z.string().optional(),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

export const applicationDefaults: ApplicationFormData = {
  university_id: "",
  application_type: ApplicationType.PHD,
  application_status: ApplicationStatus.NOT_APPLIED,
  shortlisted_faculties_id: [],
  recommenders_id: [],
  language_score_submitted: false,
  gre_submitted: false,
  gmat_submitted: false,
  remarks: "",
};
