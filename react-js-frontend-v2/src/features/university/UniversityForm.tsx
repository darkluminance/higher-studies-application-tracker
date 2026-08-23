import { useState } from "react";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Input";
import { SwitchRow } from "@/components/ui/Switch";
import { Stepper } from "@/components/ui/Stepper";
import { ChipField } from "@/components/ui/ChipField";
import { FormSection, FormFooter } from "@/features/shared/FormParts";
import { universities } from "@/features/queries";
import type { UniversityInput } from "@/lib/api";
import type { University } from "@/types";
import { isYes } from "@/types";
import { toDateInputValue, fromDateInputValue } from "@/lib/format";

interface Props {
	initial?: University | null;
	onSubmitted: () => void;
	onCancel: () => void;
}

type FormState = UniversityInput;

function makeInitial(u?: University | null): FormState {
	return {
		name: u?.name ?? "",
		website: u?.website ?? "",
		location: u?.location ?? "",
		main_ranking: u?.main_ranking ?? 0,
		application_fee: u?.application_fee ?? 0,
		application_deadline: toDateInputValue(u?.application_deadline),
		early_deadline: toDateInputValue(u?.early_deadline),
		is_gre_must: isYes(u?.is_gre_must),
		is_gmat_must: isYes(u?.is_gmat_must),
		lor_count: u?.lor_count ?? 1,
		is_official_transcript_required: isYes(u?.is_official_transcript_required),
		is_transcript_needs_evaluation: isYes(u?.is_transcript_needs_evaluation),
		accepted_evaluations: u?.accepted_evaluations ?? [],
		remarks: u?.remarks ?? "",
	};
}

export function UniversityForm({ initial, onSubmitted, onCancel }: Props) {
	const [form, setForm] = useState<FormState>(() => makeInitial(initial));
	const create = universities.useCreate();
	const update = universities.useUpdate();
	const saving = create.isPending || update.isPending;
	const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
		setForm((f) => ({ ...f, [key]: value }));

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const payload: UniversityInput = {
			...form,
			application_deadline: fromDateInputValue(form.application_deadline),
			early_deadline: fromDateInputValue(form.early_deadline),
		};
		if (initial?.id) {
			await update.mutateAsync({ ...payload, id: initial.id });
		} else {
			await create.mutateAsync(payload);
		}
		onSubmitted();
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-6">
			<FormSection label="The basics" first>
				<Field label="University name" htmlFor="uni-name">
					<Input
						id="uni-name"
						value={form.name}
						required
						onChange={(e) => set("name", e.target.value)}
					/>
				</Field>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Field label="Website" htmlFor="uni-web">
						<Input
							id="uni-web"
							value={form.website}
							placeholder="https://…"
							onChange={(e) => set("website", e.target.value)}
						/>
					</Field>
					<Field label="Location" htmlFor="uni-loc">
						<Input
							id="uni-loc"
							value={form.location}
							onChange={(e) => set("location", e.target.value)}
						/>
					</Field>
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Field label="World ranking" htmlFor="uni-rank">
						<Input
							id="uni-rank"
							type="number"
							min={0}
							value={form.main_ranking ?? 0}
							onChange={(e) => set("main_ranking", Number(e.target.value))}
						/>
					</Field>
					<Field label="Application fee" htmlFor="uni-fee">
						<Input
							id="uni-fee"
							type="number"
							min={0}
							value={form.application_fee}
							onChange={(e) => set("application_fee", Number(e.target.value))}
						/>
					</Field>
				</div>
			</FormSection>

			<FormSection label="Deadlines">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Field label="Priority deadline" htmlFor="uni-early">
						<Input
							id="uni-early"
							type="date"
							value={form.early_deadline}
							onChange={(e) => set("early_deadline", e.target.value)}
						/>
					</Field>
					<Field label="Final deadline" htmlFor="uni-final">
						<Input
							id="uni-final"
							type="date"
							value={form.application_deadline}
							onChange={(e) => set("application_deadline", e.target.value)}
						/>
					</Field>
				</div>
			</FormSection>

			<FormSection label="Requirements">
				<div className="divide-y divide-line-hair">
					<SwitchRow
						id="uni-gre"
						label="GRE required"
						checked={Boolean(form.is_gre_must)}
						onCheckedChange={(v) => set("is_gre_must", v)}
					/>
					<SwitchRow
						id="uni-gmat"
						label="GMAT required"
						checked={Boolean(form.is_gmat_must)}
						onCheckedChange={(v) => set("is_gmat_must", v)}
					/>
					<SwitchRow
						id="uni-transcript"
						label="Official transcript required"
						checked={Boolean(form.is_official_transcript_required)}
						onCheckedChange={(v) => set("is_official_transcript_required", v)}
					/>
					<SwitchRow
						id="uni-eval"
						label="Transcript needs evaluation"
						checked={Boolean(form.is_transcript_needs_evaluation)}
						onCheckedChange={(v) => set("is_transcript_needs_evaluation", v)}
					/>
				</div>
				<Field label="Letters of recommendation" className="pt-2">
					<Stepper
						value={form.lor_count}
						min={1}
						unit="letter"
						onChange={(v) => set("lor_count", v)}
					/>
				</Field>
				<Field label="Accepted evaluations" hint="e.g. WES, ECE">
					<ChipField
						value={form.accepted_evaluations}
						onChange={(v) => set("accepted_evaluations", v)}
						placeholder="Add an evaluator…"
					/>
				</Field>
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
				saveLabel={initial ? "Save changes" : "Save university"}
				onCancel={onCancel}
			/>
		</form>
	);
}
