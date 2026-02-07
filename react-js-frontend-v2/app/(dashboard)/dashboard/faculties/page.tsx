"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  Users,
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
import { FormModal, TextInputField, TextAreaField, SelectField } from "@/components/forms";
import {
  useAllFaculties,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} from "@/lib/api/services/faculty";
import { useUniversities } from "@/lib/api/services/university";
import { useFilter, useModal } from "@/lib/hooks";
import { parseCommaSeparated, joinWithCommas, getInitials } from "@/lib/utils/format";
import type { Faculty, University } from "@/lib/types";

const emptyFormData: Partial<Faculty> = {
  name: "",
  email: "",
  university_id: "",
  designation: "",
  research_areas: [],
  interested_papers: [],
};

export default function FacultiesPage() {
  const { faculties, isLoading } = useAllFaculties();
  const { universities } = useUniversities();
  const modal = useModal<Faculty>();
  const [formData, setFormData] = useState<Partial<Faculty>>(emptyFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterUniversityId, setFilterUniversityId] = useState("");

  const { searchQuery, setSearchQuery, filteredItems } = useFilter(
    faculties.filter((f) => !filterUniversityId || f.university_id === filterUniversityId),
    { searchFields: ["name", "email", "designation"] }
  );

  const getUniversityName = (universityId: string) => {
    return universities.find((u) => u.id === universityId)?.name || "Unknown";
  };

  const handleEdit = useCallback((faculty: Faculty) => {
    setFormData({
      ...faculty,
      research_areas: faculty.research_areas || [],
      interested_papers: faculty.interested_papers || [],
    });
    modal.open(faculty);
  }, [modal]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this faculty?")) return;
    try {
      await deleteFaculty(id);
      toast.success("Faculty deleted successfully");
    } catch {
      toast.error("Failed to delete faculty");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (modal.data) {
        await updateFaculty({ ...formData, id: modal.data.id } as Faculty);
        toast.success("Faculty updated successfully");
      } else {
        await createFaculty(formData as Omit<Faculty, "id" | "user_id" | "created_at" | "updated_at">);
        toast.success("Faculty created successfully");
      }
      handleClose();
    } catch {
      toast.error(modal.data ? "Failed to update faculty" : "Failed to create faculty");
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Faculties"
        description="Manage faculty contacts and track their research areas"
        icon={Users}
        iconClassName="text-primary"
        actionLabel="Add Faculty"
        onAction={() => modal.open()}
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search faculties..."
        />
        <FilterDropdown
          value={filterUniversityId}
          onChange={setFilterUniversityId}
          options={universities.map((u) => ({ value: u.id, label: u.name }))}
          placeholder="Filter by University"
          allLabel="All Universities"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((faculty) => (
          <Card key={faculty.id} className="group hover:shadow-lg transition-all">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold shrink-0">
                    {getInitials(faculty.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{faculty.name}</h3>
                    <p className="text-sm text-muted-foreground">{faculty.designation}</p>
                    <p className="text-sm text-muted-foreground">
                      {getUniversityName(faculty.university_id)}
                    </p>
                  </div>
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
                    <DropdownMenuItem onClick={() => handleEdit(faculty)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDelete(faculty.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {faculty.research_areas && faculty.research_areas.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground mb-2">Research Areas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {faculty.research_areas.slice(0, 3).map((area, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                    {faculty.research_areas.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{faculty.research_areas.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t">
                <a
                  href={`mailto:${faculty.email}`}
                  className="text-sm text-primary hover:underline"
                >
                  {faculty.email}
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <EmptyState
          icon={Users}
          title="No faculties found"
          description={
            searchQuery || filterUniversityId
              ? "Try adjusting your search or filter"
              : "Get started by adding your first faculty contact"
          }
          actionLabel="Add Faculty"
          onAction={() => modal.open()}
          showAction={!searchQuery && !filterUniversityId}
        />
      )}

      <FormModal
        open={modal.isOpen}
        onClose={handleClose}
        title={modal.data ? "Edit Faculty" : "Add Faculty"}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        submitLabel={modal.data ? "Update Faculty" : "Add Faculty"}
      >
        <TextInputField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextInputField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <SelectField
          label="University"
          name="university_id"
          value={formData.university_id}
          onChange={handleChange}
          options={universities.map((u) => ({ value: u.id, label: u.name }))}
          placeholder="Select a university"
          required
        />
        <TextInputField
          label="Designation"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          placeholder="e.g., Professor, Associate Professor"
        />
        <TextInputField
          label="Research Areas"
          name="research_areas"
          placeholder="Machine Learning, NLP (comma separated)"
          value={joinWithCommas(formData.research_areas)}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              research_areas: parseCommaSeparated(e.target.value),
            }))
          }
        />
        <TextAreaField
          label="Interested Papers"
          name="interested_papers"
          placeholder="Enter paper titles (comma or line separated)"
          value={joinWithCommas(formData.interested_papers)}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              interested_papers: e.target.value
                .split(/[,\n]/)
                .map((s) => s.trim())
                .filter(Boolean),
            }))
          }
        />
      </FormModal>
    </div>
  );
}
