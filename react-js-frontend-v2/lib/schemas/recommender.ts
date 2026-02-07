import { z } from "zod";

export const recommenderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  designation: z.string(),
  institution: z.string().min(1, "Institution is required"),
  relationship: z.string().min(1, "Relationship is required"),
});

export type RecommenderFormData = z.infer<typeof recommenderSchema>;

export const recommenderDefaults: RecommenderFormData = {
  name: "",
  email: "",
  designation: "",
  institution: "",
  relationship: "",
};
