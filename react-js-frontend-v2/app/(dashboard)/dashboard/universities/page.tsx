"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  Building2,
  MoreHorizontal,
  Pencil,
  Trash2,
  ExternalLink,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { PageHeader, LoadingState, EmptyState } from "@/components/layout";
import { SearchInput } from "@/components/data-table";
import { FormModal, TextInputField, TextAreaField, CheckboxField } from "@/components/forms";
import { useUniversities, createUniversity, updateUniversity, deleteUniversity } from "@/lib/api/services";
import { useFilter, useModal } from "@/lib/hooks";
import { formatDate, getDaysUntil } from "@/lib/utils/date";
import { parseCommaSeparated, joinWithCommas } from "@/lib/utils/format";
import type { University } from "@/lib/types";

const emptyFormData: Partial<University> = {
  name: "",
  website: "",
  location: "",
  main_ranking: null,
  application_fee: 0,
  application_deadline: "",
  early_deadline: "",
  is_gre_must: false,
  is_gmat_must: false,
  lor_count: 3,
  is_official_transcript_required: false,
  is_transcript_needs_evaluation: false,
  accepted_evaluations: [],
  remarks: "",
};

export default function UniversitiesPage() {
  const { universities, isLoading } = useUniversities();
  const modal = useModal<University>();
  const [formData, setFormData] = useState<Partial<University>>(emptyFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { searchQuery, setSearchQuery, filteredItems } = useFilter(universities, {
    searchFields: ["name", "location"],
  });

  const handleEdit = useCallback((university: University) => {
    setFormData({
      ...university,
      application_deadline: university.application_deadline?.split("T")[0] || "",
      early_deadline: university.early_deadline?.split("T")[0] || "",
    });
    modal.open(university);
  }, [modal]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this university?")) return;
    try {
      await deleteUniversity(id);
      toast.success("University deleted successfully");
    } catch {
      toast.error("Failed to delete university");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        application_deadline: formData.application_deadline
          ? new Date(formData.application_deadline).toISOString()
          : "",
        early_deadline: formData.early_deadline
          ? new Date(formData.early_deadline).toISOString()
          : "",
      };

      if (modal.data) {
        await updateUniversity({ ...payload, id: modal.data.id } as University);
        toast.success("University updated successfully");
      } else {
        await createUniversity(payload as Omit<University, "id" | "user_id" | "created_at" | "updated_at">);
        toast.success("University created successfully");
      }

      handleClose();
    } catch {
      toast.error(modal.data ? "Failed to update university" : "Failed to create university");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    modal.close();
    setFormData(emptyFormData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let finalValue: string | number | boolean | null = value;

    if (type === "checkbox") {
      finalValue = (e.target as HTMLInputElement).checked;
    } else if (type === "number") {
      finalValue = value === "" ? null : Number(value);
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Universities"
        description="Manage your target universities and track their requirements"
        icon={Building2}
        iconClassName="text-gold"
        actionLabel="Add University"
        onAction={() => modal.open()}
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search universities..."
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((university) => (
          <UniversityCard
            key={university.id}
            university={university}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <EmptyState
          icon={Building2}
          title="No universities found"
          description={
            searchQuery
              ? "Try adjusting your search query"
              : "Get started by adding your first university"
          }
          actionLabel="Add University"
          onAction={() => modal.open()}
          showAction={!searchQuery}
        />
      )}

      <FormModal
        open={modal.isOpen}
        onClose={handleClose}
        title={modal.data ? "Edit University" : "Add University"}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        submitLabel={modal.data ? "Update University" : "Add University"}
        maxWidth="max-w-2xl"
      >
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Basic Information
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <TextInputField
                label="University Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <TextInputField
              label="Website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
            />
            <TextInputField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
            <TextInputField
              label="Ranking"
              name="main_ranking"
              type="number"
              value={formData.main_ranking}
              onChange={handleChange}
            />
            <TextInputField
              label="Application Fee ($)"
              name="application_fee"
              type="number"
              value={formData.application_fee}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Deadlines */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Deadlines
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <TextInputField
              label="Application Deadline"
              name="application_deadline"
              type="date"
              value={formData.application_deadline}
              onChange={handleChange}
            />
            <TextInputField
              label="Early Deadline"
              name="early_deadline"
              type="date"
              value={formData.early_deadline}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Requirements */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Requirements
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <TextInputField
              label="LOR Count"
              name="lor_count"
              type="number"
              min={0}
              max={5}
              value={formData.lor_count}
              onChange={handleChange}
            />
            <TextInputField
              label="Accepted Evaluations"
              name="accepted_evaluations"
              placeholder="WES, ECE (comma separated)"
              value={joinWithCommas(formData.accepted_evaluations)}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  accepted_evaluations: parseCommaSeparated(e.target.value),
                }))
              }
            />
          </div>
          <div className="flex flex-wrap gap-6">
            <CheckboxField
              label="GRE Required"
              name="is_gre_must"
              checked={formData.is_gre_must}
              onChange={handleChange}
            />
            <CheckboxField
              label="GMAT Required"
              name="is_gmat_must"
              checked={formData.is_gmat_must}
              onChange={handleChange}
            />
            <CheckboxField
              label="Official Transcript Required"
              name="is_official_transcript_required"
              checked={formData.is_official_transcript_required}
              onChange={handleChange}
            />
            <CheckboxField
              label="Transcript Evaluation Needed"
              name="is_transcript_needs_evaluation"
              checked={formData.is_transcript_needs_evaluation}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Notes */}
        <TextAreaField
          label="Notes"
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
        />
      </FormModal>
    </div>
  );
}

// University Card Component
function UniversityCard({
  university,
  onEdit,
  onDelete,
}: {
  university: University;
  onEdit: (u: University) => void;
  onDelete: (id: string) => void;
}) {
  const daysLeft = university.application_deadline
    ? getDaysUntil(university.application_deadline)
    : null;
  const isUrgent = daysLeft !== null && daysLeft <= 7 && daysLeft > 0;
  const isPast = daysLeft !== null && daysLeft < 0;

  return (
    <Card className="group hover:shadow-lg transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-semibold truncate">
              {university.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {university.location}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(university)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              {university.website && (
                <DropdownMenuItem asChild>
                  <a
                    href={university.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Website
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(university.id)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm">
          {university.main_ranking && (
            <Badge variant="secondary" className="font-normal">
              #{university.main_ranking}
            </Badge>
          )}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <DollarSign className="w-3.5 h-3.5" />
            <span>${university.application_fee}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <FileText className="w-3.5 h-3.5" />
            <span>{university.lor_count} LORs</span>
          </div>
        </div>

        {university.application_deadline && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                {formatDate(university.application_deadline)}
              </span>
            </div>
            {daysLeft !== null && (
              <Badge
                variant={isPast ? "destructive" : isUrgent ? "default" : "secondary"}
                className={isUrgent ? "bg-warning text-warning-foreground" : ""}
              >
                {isPast
                  ? "Passed"
                  : daysLeft === 0
                  ? "Today"
                  : `${daysLeft} days`}
              </Badge>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className={
              university.is_gre_must
                ? "border-success/50 text-success"
                : "border-muted-foreground/30"
            }
          >
            {university.is_gre_must ? (
              <CheckCircle2 className="w-3 h-3 mr-1" />
            ) : (
              <XCircle className="w-3 h-3 mr-1" />
            )}
            GRE
          </Badge>
          <Badge
            variant="outline"
            className={
              university.is_official_transcript_required
                ? "border-success/50 text-success"
                : "border-muted-foreground/30"
            }
          >
            {university.is_official_transcript_required ? (
              <CheckCircle2 className="w-3 h-3 mr-1" />
            ) : (
              <XCircle className="w-3 h-3 mr-1" />
            )}
            Official Transcript
          </Badge>
        </div>

        {university.remarks && (
          <p className="text-sm text-muted-foreground truncate">
            {university.remarks}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
