"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Video,
  Pencil,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { PageHeader, LoadingState, EmptyState } from "@/components/layout";
import { SearchInput, FilterDropdown } from "@/components/data-table";
import { FormModal, TextInputField, TextAreaField, SelectField, CheckboxField } from "@/components/forms";
import { useInterviews, createInterview, updateInterview, deleteInterview } from "@/lib/api/services/interview";
import { useAllFaculties } from "@/lib/api/services/faculty";
import { useFilter, useModal } from "@/lib/hooks";
import { formatDateWithWeekday } from "@/lib/utils/date";
import type { Interview } from "@/lib/types";

const emptyFormData: Partial<Interview> = {
  faculty_id: "",
  date: "",
  time: "",
  is_completed: false,
  remarks: "",
};

export default function InterviewsPage() {
  const { interviews, isLoading } = useInterviews();
  const { faculties } = useAllFaculties();
  const modal = useModal<Interview>();
  const [formData, setFormData] = useState<Partial<Interview>>(emptyFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterFacultyId, setFilterFacultyId] = useState("");

  const filteredByFaculty = interviews.filter(
    (i) => !filterFacultyId || i.faculty_id === filterFacultyId
  );

  const { searchQuery, setSearchQuery, filteredItems } = useFilter(filteredByFaculty, {
    searchFields: ["remarks"],
  });

  const getFacultyName = (facultyId: string) => {
    return faculties.find((f) => f.id === facultyId)?.name || "Unknown";
  };

  const handleEdit = useCallback((interview: Interview) => {
    setFormData({
      ...interview,
      is_completed: interview.is_completed,
      date: interview.date?.split("T")[0] || "",
    });
    modal.open(interview);
  }, [modal]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this interview?")) return;
    try {
      await deleteInterview(id);
      toast.success("Interview deleted successfully");
    } catch {
      toast.error("Failed to delete interview");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        date: formData.date ? new Date(formData.date).toISOString() : "",
      };

      if (modal.data) {
        await updateInterview({ ...payload, id: modal.data.id } as Interview);
        toast.success("Interview updated successfully");
      } else {
        await createInterview(
          payload as Omit<Interview, "id" | "user_id" | "created_at" | "updated_at">
        );
        toast.success("Interview scheduled successfully");
      }
      handleClose();
    } catch {
      toast.error(modal.data ? "Failed to update interview" : "Failed to schedule interview");
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
    const finalValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interviews"
        description="Schedule and track your interviews with faculty members"
        icon={Calendar}
        iconClassName="text-warning"
        actionLabel="Schedule Interview"
        onAction={() => modal.open()}
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search interviews..."
        />
        <FilterDropdown
          value={filterFacultyId}
          onChange={setFilterFacultyId}
          options={faculties.map((f) => ({ value: f.id, label: f.name }))}
          placeholder="Filter by Faculty"
          allLabel="All Faculties"
        />
      </div>

      <div className="space-y-4">
        {filteredItems.map((interview) => {
          const interviewDate = new Date(interview.date);
          const isUpcoming = interviewDate > new Date();
          const isCompleted = interview.is_completed;

          return (
            <Card
              key={interview.id}
              className={`hover:shadow-lg transition-all group ${
                isCompleted ? "opacity-75" : ""
              }`}
            >
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        isCompleted ? "bg-success/10" : "bg-warning/10"
                      }`}
                    >
                      <Video
                        className={`w-5 h-5 ${
                          isCompleted ? "text-success" : "text-warning"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">
                        {getFacultyName(interview.faculty_id)}
                      </h3>
                      <p className="text-sm text-muted-foreground">Faculty Interview</p>
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
                        <DropdownMenuItem onClick={() => handleEdit(interview)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(interview.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">
                        {formatDateWithWeekday(interview.date)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {interview.time}
                      </div>
                    </div>

                    <Badge
                      variant={isCompleted ? "default" : "secondary"}
                      className={
                        isCompleted
                          ? "bg-success/10 text-success border-success/20"
                          : isUpcoming
                          ? "bg-warning/10 text-warning border-warning/20"
                          : ""
                      }
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Completed
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 mr-1" />
                          Upcoming
                        </>
                      )}
                    </Badge>
                  </div>
                </div>

                {interview.remarks && (
                  <p className="mt-4 text-sm text-muted-foreground pl-16">
                    {interview.remarks}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <EmptyState
          icon={Calendar}
          title="No interviews found"
          description={
            searchQuery || filterFacultyId
              ? "Try adjusting your search or filter"
              : "Get started by scheduling your first interview"
          }
          actionLabel="Schedule Interview"
          onAction={() => modal.open()}
          showAction={!searchQuery && !filterFacultyId}
        />
      )}

      <FormModal
        open={modal.isOpen}
        onClose={handleClose}
        title={modal.data ? "Edit Interview" : "Schedule Interview"}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        submitLabel={modal.data ? "Update Interview" : "Schedule Interview"}
      >
        <SelectField
          label="Faculty"
          name="faculty_id"
          value={formData.faculty_id}
          onChange={handleChange}
          options={faculties.map((f) => ({ value: f.id, label: f.name }))}
          placeholder="Select a faculty"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <TextInputField
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <TextInputField
            label="Time"
            name="time"
            type="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <CheckboxField
          label="Interview Completed"
          name="is_completed"
          checked={formData.is_completed}
          onChange={handleChange}
        />

        <TextAreaField
          label="Remarks"
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          placeholder="Add notes about the interview..."
        />
      </FormModal>
    </div>
  );
}
