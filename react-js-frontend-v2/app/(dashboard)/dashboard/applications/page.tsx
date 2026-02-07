"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Pencil,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { PageHeader, LoadingState, EmptyState } from "@/components/layout";
import { SearchInput, FilterDropdown } from "@/components/data-table";
import { FormModal, SelectField, TextAreaField, CheckboxField } from "@/components/forms";
import {
  useApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from "@/lib/api/services/application";
import { useUniversities } from "@/lib/api/services/university";
import { useAllFaculties, getFacultiesByUniversity } from "@/lib/api/services/faculty";
import { useRecommenders } from "@/lib/api/services/recommender";
import { useFilter, useModal } from "@/lib/hooks";
import { APPLICATION_STATUSES, APPLICATION_TYPES, getApplicationStatusConfig } from "@/lib/constants";
import type { Application, Faculty } from "@/lib/types";

const emptyFormData: Partial<Application> = {
  university_id: "",
  application_type: "",
  shortlisted_faculties_id: [],
  recommenders_id: [],
  application_status: "NOT APPLIED",
  language_score_submitted: false,
  gre_submitted: false,
  gmat_submitted: false,
  remarks: "",
};

export default function ApplicationsPage() {
  const { applications, isLoading } = useApplications();
  const { universities } = useUniversities();
  const { faculties } = useAllFaculties();
  const { recommenders } = useRecommenders();
  const modal = useModal<Application>();
  const [formData, setFormData] = useState<Partial<Application>>(emptyFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [universityFaculties, setUniversityFaculties] = useState<Faculty[]>([]);

  const { searchQuery, setSearchQuery, filteredItems } = useFilter(
    applications.filter((a) => !filterStatus || a.application_status === filterStatus),
    { searchFields: ["application_type", "remarks"] }
  );

  // Load faculties when university changes
  useEffect(() => {
    if (formData.university_id) {
      const filtered = faculties.filter((f) => f.university_id === formData.university_id);
      setUniversityFaculties(filtered);
    } else {
      setUniversityFaculties([]);
    }
  }, [formData.university_id, faculties]);

  const getUniversityName = (universityId: string) => {
    return universities.find((u) => u.id === universityId)?.name || "Unknown";
  };

  const getUniversityLorCount = (universityId: string) => {
    return universities.find((u) => u.id === universityId)?.lor_count || 3;
  };

  const handleEdit = useCallback((application: Application) => {
    setFormData({
      ...application,
      shortlisted_faculties_id: application.shortlisted_faculties_id || [],
      recommenders_id: application.recommenders_id || [],
    });
    modal.open(application);
  }, [modal]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    try {
      await deleteApplication(id);
      toast.success("Application deleted successfully");
    } catch {
      toast.error("Failed to delete application");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (modal.data) {
        await updateApplication({ ...formData, id: modal.data.id } as Application);
        toast.success("Application updated successfully");
      } else {
        await createApplication(
          formData as Omit<Application, "id" | "user_id" | "created_at" | "updated_at">
        );
        toast.success("Application created successfully");
      }
      handleClose();
    } catch {
      toast.error(modal.data ? "Failed to update application" : "Failed to create application");
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
    if (name === "university_id") {
      // Reset faculties when university changes
      setFormData((prev) => ({
        ...prev,
        university_id: value,
        shortlisted_faculties_id: [],
      }));
    } else {
      const finalValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
      setFormData((prev) => ({ ...prev, [name]: finalValue }));
    }
  };

  const toggleFaculty = (facultyId: string) => {
    const current = formData.shortlisted_faculties_id || [];
    if (current.includes(facultyId)) {
      setFormData((prev) => ({
        ...prev,
        shortlisted_faculties_id: current.filter((id) => id !== facultyId),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        shortlisted_faculties_id: [...current, facultyId],
      }));
    }
  };

  const toggleRecommender = (recommenderId: string) => {
    const current = formData.recommenders_id || [];
    const maxRecommenders = formData.university_id ? getUniversityLorCount(formData.university_id) : 3;

    if (current.includes(recommenderId)) {
      setFormData((prev) => ({
        ...prev,
        recommenders_id: current.filter((id) => id !== recommenderId),
      }));
    } else if (current.length < maxRecommenders) {
      setFormData((prev) => ({
        ...prev,
        recommenders_id: [...current, recommenderId],
      }));
    } else {
      toast.error(`Maximum ${maxRecommenders} recommenders allowed`);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  // Stats
  const stats = {
    total: applications.length,
    applied: applications.filter((a) => a.application_status === "APPLIED").length,
    inProgress: applications.filter((a) => a.application_status === "IN PROGRESS").length,
    notStarted: applications.filter((a) => a.application_status === "NOT APPLIED").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        description="Track all your graduate school applications"
        icon={FileText}
        iconClassName="text-chart-5"
        actionLabel="New Application"
        onAction={() => modal.open()}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, color: "text-primary" },
          { label: "Applied", value: stats.applied, color: "text-success" },
          { label: "In Progress", value: stats.inProgress, color: "text-warning" },
          { label: "Not Started", value: stats.notStarted, color: "text-muted-foreground" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className={`text-2xl font-serif font-semibold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search applications..."
        />
        <FilterDropdown
          value={filterStatus}
          onChange={setFilterStatus}
          options={APPLICATION_STATUSES.map((s) => ({
            value: s,
            label: getApplicationStatusConfig(s).label,
          }))}
          placeholder="Filter by Status"
          allLabel="All Statuses"
        />
      </div>

      <div className="space-y-4">
        {filteredItems.map((app) => {
          const statusConfig = getApplicationStatusConfig(app.application_status);
          const StatusIcon = app.application_status === "APPLIED" ? CheckCircle2 :
            app.application_status === "IN PROGRESS" ? Clock : AlertCircle;
          const lorSubmitted = app.recommenders_id?.length || 0;
          const lorTotal = getUniversityLorCount(app.university_id);
          const lorProgress = (lorSubmitted / lorTotal) * 100;

          return (
            <Card key={app.id} className="hover:shadow-lg transition-all group">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-semibold shrink-0">
                        {getUniversityName(app.university_id).slice(0, 3)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-semibold text-lg">
                            {getUniversityName(app.university_id)}
                          </h3>
                          <Badge variant={statusConfig.variant} className={statusConfig.className}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1">{app.application_type}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>
                            {(app.shortlisted_faculties_id || []).length} faculty shortlisted
                          </span>
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
                          <DropdownMenuItem onClick={() => handleEdit(app)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(app.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="lg:w-72 space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Recommendations</span>
                        <span className="font-medium">{lorSubmitted}/{lorTotal}</span>
                      </div>
                      <Progress value={lorProgress} className="h-2" />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className={app.language_score_submitted ? "border-success/50 text-success" : ""}
                      >
                        {app.language_score_submitted ? (
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        TOEFL/IELTS
                      </Badge>
                      <Badge
                        variant="outline"
                        className={app.gre_submitted ? "border-success/50 text-success" : ""}
                      >
                        {app.gre_submitted ? (
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        GRE
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/dashboard/applications/${app.id}/lor`}>
                          LOR Status
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Link>
                      </Button>
                      <Button size="sm" className="flex-1" onClick={() => handleEdit(app)}>
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <EmptyState
          icon={FileText}
          title="No applications found"
          description={
            searchQuery || filterStatus
              ? "Try adjusting your search or filter"
              : "Get started by creating your first application"
          }
          actionLabel="New Application"
          onAction={() => modal.open()}
          showAction={!searchQuery && !filterStatus}
        />
      )}

      <FormModal
        open={modal.isOpen}
        onClose={handleClose}
        title={modal.data ? "Edit Application" : "New Application"}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        submitLabel={modal.data ? "Update Application" : "Create Application"}
        maxWidth="max-w-2xl"
      >
        <SelectField
          label="University"
          name="university_id"
          value={formData.university_id}
          onChange={handleChange}
          options={universities.map((u) => ({ value: u.id, label: u.name }))}
          placeholder="Select a university"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Application Type"
            name="application_type"
            value={formData.application_type}
            onChange={handleChange}
            options={APPLICATION_TYPES.map((t) => ({ value: t, label: t }))}
            placeholder="Select type"
            required
          />
          <SelectField
            label="Status"
            name="application_status"
            value={formData.application_status}
            onChange={handleChange}
            options={APPLICATION_STATUSES.map((s) => ({
              value: s,
              label: getApplicationStatusConfig(s).label,
            }))}
            required
          />
        </div>

        {formData.university_id && universityFaculties.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Shortlisted Faculties</label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/30">
              {universityFaculties.map((faculty) => {
                const isSelected = formData.shortlisted_faculties_id?.includes(faculty.id);
                return (
                  <Badge
                    key={faculty.id}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleFaculty(faculty.id)}
                  >
                    {isSelected && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {faculty.name}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Recommenders
            {formData.university_id && (
              <span className="text-muted-foreground ml-1">
                (max {getUniversityLorCount(formData.university_id)})
              </span>
            )}
          </label>
          <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/30">
            {recommenders.length > 0 ? (
              recommenders.map((recommender) => {
                const isSelected = formData.recommenders_id?.includes(recommender.id);
                return (
                  <Badge
                    key={recommender.id}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleRecommender(recommender.id)}
                  >
                    {isSelected && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {recommender.name}
                  </Badge>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">
                No recommenders available. Add recommenders first.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Score Submissions</label>
          <div className="flex flex-wrap gap-6">
            <CheckboxField
              label="TOEFL/IELTS Submitted"
              name="language_score_submitted"
              checked={formData.language_score_submitted}
              onChange={handleChange}
            />
            <CheckboxField
              label="GRE Submitted"
              name="gre_submitted"
              checked={formData.gre_submitted}
              onChange={handleChange}
            />
            <CheckboxField
              label="GMAT Submitted"
              name="gmat_submitted"
              checked={formData.gmat_submitted}
              onChange={handleChange}
            />
          </div>
        </div>

        <TextAreaField
          label="Remarks"
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          placeholder="Add notes about this application..."
        />
      </FormModal>
    </div>
  );
}
