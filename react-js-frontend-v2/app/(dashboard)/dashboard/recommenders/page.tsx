"use client";

import { useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { UserCheck } from "lucide-react";
import { PageHeader, LoadingState, EmptyState } from "@/components/layout";
import { SearchInput } from "@/components/data-table";
import { ValidatedInput } from "@/components/forms";
import { RecommenderCard } from "@/components/cards";
import {
  useRecommenders,
  createRecommender,
  updateRecommender,
  deleteRecommender,
} from "@/lib/api/services/recommender";
import { useFilter, useModal } from "@/lib/hooks";
import { recommenderSchema, recommenderDefaults, type RecommenderFormData } from "@/lib/schemas";
import type { Recommender } from "@/lib/types";

// Dynamic import for form modal to reduce initial bundle size
const FormModal = dynamic(
  () => import("@/components/forms/form-modal").then((m) => m.FormModal),
  { ssr: false }
);

export default function RecommendersPage() {
  const { recommenders, isLoading } = useRecommenders();
  const modal = useModal<Recommender>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RecommenderFormData>({
    resolver: zodResolver(recommenderSchema),
    defaultValues: recommenderDefaults,
  });

  const { searchQuery, setSearchQuery, filteredItems } = useFilter(recommenders, {
    searchFields: ["name", "email", "institution"],
  });

  // Reset form when modal opens/closes or editing item changes
  useEffect(() => {
    if (modal.isOpen && modal.data) {
      reset({
        name: modal.data.name,
        email: modal.data.email,
        designation: modal.data.designation || "",
        institution: modal.data.institution,
        relationship: modal.data.relationship,
      });
    } else if (modal.isOpen) {
      reset(recommenderDefaults);
    }
  }, [modal.isOpen, modal.data, reset]);

  const handleEdit = useCallback((recommender: Recommender) => {
    modal.open(recommender);
  }, [modal]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this recommender?")) return;
    try {
      await deleteRecommender(id);
      toast.success("Recommender deleted successfully");
    } catch {
      toast.error("Failed to delete recommender");
    }
  }, []);

  const onSubmit = async (data: RecommenderFormData) => {
    try {
      if (modal.data) {
        await updateRecommender({ ...data, id: modal.data.id } as Recommender);
        toast.success("Recommender updated successfully");
      } else {
        await createRecommender(data);
        toast.success("Recommender added successfully");
      }
      handleClose();
    } catch {
      toast.error(modal.data ? "Failed to update recommender" : "Failed to add recommender");
    }
  };

  const handleClose = () => {
    modal.close();
    reset(recommenderDefaults);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recommenders"
        description="Manage your recommendation letter writers"
        icon={UserCheck}
        iconClassName="text-chart-4"
        actionLabel="Add Recommender"
        onAction={() => modal.open()}
      />

      <div className="relative max-w-md">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search recommenders..."
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((recommender) => (
          <RecommenderCard
            key={recommender.id}
            recommender={recommender}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <EmptyState
          icon={UserCheck}
          title="No recommenders found"
          description={
            searchQuery
              ? "Try adjusting your search"
              : "Get started by adding your first recommender"
          }
          actionLabel="Add Recommender"
          onAction={() => modal.open()}
          showAction={!searchQuery}
        />
      )}

      <FormModal
        open={modal.isOpen}
        onClose={handleClose}
        title={modal.data ? "Edit Recommender" : "Add Recommender"}
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
        submitLabel={modal.data ? "Update Recommender" : "Add Recommender"}
      >
        <ValidatedInput<RecommenderFormData>
          label="Name"
          name="name"
          register={register}
          error={errors.name}
          required
        />
        <ValidatedInput<RecommenderFormData>
          label="Email"
          name="email"
          type="email"
          register={register}
          error={errors.email}
          required
        />
        <ValidatedInput<RecommenderFormData>
          label="Designation"
          name="designation"
          register={register}
          error={errors.designation}
          placeholder="e.g., Professor, Research Scientist"
        />
        <ValidatedInput<RecommenderFormData>
          label="Institution"
          name="institution"
          register={register}
          error={errors.institution}
          required
        />
        <ValidatedInput<RecommenderFormData>
          label="Relationship"
          name="relationship"
          register={register}
          error={errors.relationship}
          placeholder="e.g., PhD Advisor, Internship Supervisor"
          required
        />
      </FormModal>
    </div>
  );
}
