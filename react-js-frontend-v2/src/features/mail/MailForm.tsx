import { useState } from "react";
import { Field } from "@/components/ui/Field";
import { Select, Textarea } from "@/components/ui/Input";
import { SwitchRow } from "@/components/ui/Switch";
import { FormSection, FormFooter } from "@/features/shared/FormParts";
import { mails, faculties, useEnum } from "@/features/queries";
import { toast } from "@/lib/toast";
import type { MailInput } from "@/lib/api";
import type { Mail } from "@/types";
import { isYes } from "@/types";

interface Props {
	initial?: Mail | null;
	onSubmitted: () => void;
	onCancel: () => void;
}

const makeInitial = (m?: Mail | null): MailInput => ({
	faculty_id: m?.faculty_id ?? "",
	faculty_name: m?.faculty_name ?? "",
	is_mailed: isYes(m?.is_mailed),
	is_mail_replied: isYes(m?.is_mail_replied),
	reply_vibe: m?.reply_vibe ?? "",
	is_interview_requested: isYes(m?.is_interview_requested),
	remarks: m?.remarks ?? "",
});

export function MailForm({ initial, onSubmitted, onCancel }: Props) {
	const [form, setForm] = useState<MailInput>(() => makeInitial(initial));
	const { data: facultyList } = faculties.useList();
	const { data: vibes } = useEnum("reply_vibe_enum");
	const create = mails.useCreate();
	const update = mails.useUpdate();
	const saving = create.isPending || update.isPending;
	const set = <K extends keyof MailInput>(key: K, value: MailInput[K]) =>
		setForm((f) => ({ ...f, [key]: value }));

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!form.faculty_id) {
			toast.error("Please choose a faculty first.");
			return;
		}
		if (initial?.id) await update.mutateAsync({ ...form, id: initial.id });
		else await create.mutateAsync(form);
		onSubmitted();
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-6">
			<FormSection label="The conversation" first>
				<Field label="Faculty" htmlFor="mail-fac">
					<Select
						id="mail-fac"
						value={form.faculty_id}
						onChange={(e) => set("faculty_id", e.target.value)}
					>
						<option value="">Select a faculty</option>
						{(facultyList ?? []).map((f) => (
							<option key={f.id} value={f.id}>
								{f.name}
							</option>
						))}
					</Select>
				</Field>
				<Field label="Reply vibe" htmlFor="mail-vibe">
					<Select
						id="mail-vibe"
						value={form.reply_vibe}
						onChange={(e) => set("reply_vibe", e.target.value)}
					>
						<option value="">Not sure yet</option>
						{(vibes ?? []).map((v) => (
							<option key={v} value={v}>
								{v}
							</option>
						))}
					</Select>
				</Field>
			</FormSection>

			<FormSection label="Where it stands">
				<div className="divide-y divide-line-hair">
					<SwitchRow
						id="mail-sent"
						label="Email sent"
						checked={Boolean(form.is_mailed)}
						onCheckedChange={(v) => set("is_mailed", v)}
					/>
					<SwitchRow
						id="mail-replied"
						label="They replied"
						tone="sage"
						checked={Boolean(form.is_mail_replied)}
						onCheckedChange={(v) => set("is_mail_replied", v)}
					/>
					<SwitchRow
						id="mail-interview"
						label="Interview invited"
						tone="sage"
						checked={Boolean(form.is_interview_requested)}
						onCheckedChange={(v) => set("is_interview_requested", v)}
					/>
				</div>
			</FormSection>

			<FormSection label="Notes">
				<Textarea
					value={form.remarks}
					rows={2}
					placeholder="Anything worth remembering…"
					onChange={(e) => set("remarks", e.target.value)}
				/>
			</FormSection>

			<FormFooter
				saving={saving}
				saveLabel={initial ? "Save changes" : "Log this email"}
				onCancel={onCancel}
			/>
		</form>
	);
}
