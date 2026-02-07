"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  Mail,
  CheckCircle2,
  Clock,
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
import { SearchInput } from "@/components/data-table";
import { FormModal, SelectField, TextAreaField, CheckboxField } from "@/components/forms";
import { useMails, createMail, updateMail, deleteMail } from "@/lib/api/services/mail";
import { useAllFaculties } from "@/lib/api/services/faculty";
import { useFilter, useModal } from "@/lib/hooks";
import { REPLY_VIBES } from "@/lib/constants";
import type { Mail as MailType } from "@/lib/types";

const emptyFormData: Partial<MailType> = {
  faculty_id: "",
  is_mailed: false,
  is_mail_replied: false,
  reply_vibe: "",
  is_interview_requested: false,
  remarks: "",
};

export default function MailsPage() {
  const { mails, isLoading } = useMails();
  const { faculties } = useAllFaculties();
  const modal = useModal<MailType>();
  const [formData, setFormData] = useState<Partial<MailType>>(emptyFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { searchQuery, setSearchQuery, filteredItems } = useFilter(mails, {
    searchFields: ["faculty_name", "remarks"],
  });

  const getFacultyName = (facultyId: string) => {
    return faculties.find((f) => f.id === facultyId)?.name || "Unknown";
  };

  const handleEdit = useCallback((mail: MailType) => {
    setFormData({
      ...mail,
      is_mailed: mail.is_mailed,
      is_mail_replied: mail.is_mail_replied,
      is_interview_requested: mail.is_interview_requested,
    });
    modal.open(mail);
  }, [modal]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this mail record?")) return;
    try {
      await deleteMail(id);
      toast.success("Mail record deleted successfully");
    } catch {
      toast.error("Failed to delete mail record");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (modal.data) {
        await updateMail({ ...formData, id: modal.data.id } as MailType);
        toast.success("Mail record updated successfully");
      } else {
        await createMail(
          formData as Omit<MailType, "id" | "user_id" | "faculty_name" | "created_at" | "updated_at">
        );
        toast.success("Mail record created successfully");
      }
      handleClose();
    } catch {
      toast.error(modal.data ? "Failed to update mail record" : "Failed to create mail record");
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
        title="Mail Correspondence"
        description="Track your email communications with faculty members"
        icon={Mail}
        iconClassName="text-success"
        actionLabel="Log Email"
        onAction={() => modal.open()}
      />

      <div className="relative max-w-md">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by faculty or notes..."
        />
      </div>

      <div className="space-y-4">
        {filteredItems.map((mail) => (
          <Card key={mail.id} className="hover:shadow-lg transition-all group">
            <CardContent className="p-5">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">
                      {mail.faculty_name || getFacultyName(mail.faculty_id)}
                    </h3>
                    <p className="text-sm text-muted-foreground">Faculty Contact</p>
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
                      <DropdownMenuItem onClick={() => handleEdit(mail)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(mail.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={mail.is_mail_replied ? "default" : "secondary"}
                    className={
                      mail.is_mail_replied
                        ? "bg-success/10 text-success border-success/20"
                        : ""
                    }
                  >
                    {mail.is_mail_replied ? (
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                    ) : (
                      <Clock className="w-3 h-3 mr-1" />
                    )}
                    {mail.is_mail_replied ? "Replied" : "Awaiting Reply"}
                  </Badge>

                  {mail.reply_vibe && (
                    <Badge
                      variant="outline"
                      className={
                        mail.reply_vibe === "ENTHUSIASTIC"
                          ? "border-success/50 text-success"
                          : ""
                      }
                    >
                      {mail.reply_vibe}
                    </Badge>
                  )}

                  {mail.is_interview_requested && (
                    <Badge className="bg-gold/10 text-gold border-gold/20">
                      Interview Requested
                    </Badge>
                  )}
                </div>
              </div>

              {mail.remarks && (
                <p className="mt-4 text-sm text-muted-foreground pl-16">
                  {mail.remarks}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <EmptyState
          icon={Mail}
          title="No mail records found"
          description={
            searchQuery
              ? "Try adjusting your search"
              : "Get started by logging your first email communication"
          }
          actionLabel="Log Email"
          onAction={() => modal.open()}
          showAction={!searchQuery}
        />
      )}

      <FormModal
        open={modal.isOpen}
        onClose={handleClose}
        title={modal.data ? "Edit Mail Record" : "Log Email"}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        submitLabel={modal.data ? "Update Record" : "Log Email"}
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

        <div className="flex flex-wrap gap-6">
          <CheckboxField
            label="Email Sent"
            name="is_mailed"
            checked={formData.is_mailed}
            onChange={handleChange}
          />
          <CheckboxField
            label="Received Reply"
            name="is_mail_replied"
            checked={formData.is_mail_replied}
            onChange={handleChange}
          />
          <CheckboxField
            label="Interview Requested"
            name="is_interview_requested"
            checked={formData.is_interview_requested}
            onChange={handleChange}
          />
        </div>

        <SelectField
          label="Reply Vibe"
          name="reply_vibe"
          value={formData.reply_vibe}
          onChange={handleChange}
          options={REPLY_VIBES.map((v) => ({ value: v, label: v }))}
          placeholder="Select reply vibe"
        />

        <TextAreaField
          label="Remarks"
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          placeholder="Add notes about the conversation..."
        />
      </FormModal>
    </div>
  );
}
