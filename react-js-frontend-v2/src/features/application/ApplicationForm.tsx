import { useEffect, useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import { Field } from "@/components/ui/Field";
import { Select, Textarea } from "@/components/ui/Input";
import { SwitchRow } from "@/components/ui/Switch";
import { FormSection, FormFooter } from "@/features/shared/FormParts";
import {
	applications,
	universities,
	recommenders as recommenderQueries,
	useFacultiesByUniversity,
	useEnum,
} from "@/features/queries";
import { toast } from "@/lib/toast";
import type { ApplicationInput } from "@/lib/api";
import type { Application } from "@/types";
import { isYes } from "@/types";

interface Props {
	initial?: Application | null;
	onSubmitted: () => void;
	onCancel: () => void;
}

interface Option {
	id: string;
	name: string;
}

/** Dynamic list of selects with add/remove, used for faculties & recommenders. */
function RepeatingSelect({
	label,
	values,
	options,
	onChange,
	addLabel,
	max,
	emptyHint,
}: {
	label: string;
	values: string[];
	options: Option[];
	onChange: (values: string[]) => void;
	addLabel: string;
	max?: number;
	emptyHint?: string;
}) {
	const add = () => {
		if (max !== undefined && values.length >= max) {
			toast.error(
				max === 0 ? "Select a university first." : `Up to ${max} allowed.`
			);
			return;
		}
		onChange([...values, ""]);
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<span className="text-[11.5px] font-semibold text-ink-soft">{label}</span>
				<button
					type="button"
					onClick={add}
					className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-clay hover:text-clay-hover"
				>
					<Plus size={14} /> {addLabel}
				</button>
			</div>
			{values.length === 0 && emptyHint && (
				<p className="text-[12px] text-ink-faint">{emptyHint}</p>
			)}
			{values.map((val, idx) => (
				<div key={idx} className="flex items-center gap-2">
					<Select
						value={val}
						onChange={(e) => {
							const next = [...values];
							next[idx] = e.target.value;
							onChange(next);
						}}
					>
						<option value="">Select…</option>
						{options.map((o) => (
							<option key={o.id} value={o.id}>
								{o.name}
							</option>
						))}
					</Select>
					<button
						type="button"
						onClick={() => onChange(values.filter((_, i) => i !== idx))}
						className="shrink-0 rounded-full p-2 text-ink-faint hover:bg-rail hover:text-ink-muted"
						aria-label="Remove"
					>
						<X size={16} />
					</button>
				</div>
			))}
		</div>
	);
}

const makeInitial = (a?: Application | null): ApplicationInput => ({
	university_id: a?.university_id ?? "",
	application_type: a?.application_type ?? "",
	shortlisted_faculties_id: a?.shortlisted_faculties_id ?? [],
	recommenders_id: a?.recommenders_id ?? [],
	application_status: a?.application_status ?? "",
	language_score_submitted: isYes(a?.language_score_submitted),
	gre_submitted: isYes(a?.gre_submitted),
	gmat_submitted: isYes(a?.gmat_submitted),
	remarks: a?.remarks ?? "",
});

export function ApplicationForm({ initial, onSubmitted, onCancel }: Props) {
	const [form, setForm] = useState<ApplicationInput>(() => makeInitial(initial));

	const { data: unis } = universities.useList();
	const { data: recs } = recommenderQueries.useList();
	const { data: facs } = useFacultiesByUniversity(form.university_id || undefined);
	const { data: typeEnum } = useEnum("application_type_enum");
	const { data: statusEnum } = useEnum("university_application_status_enum");

	const create = applications.useCreate();
	const update = applications.useUpdate();
	const saving = create.isPending || update.isPending;
	const set = <K extends keyof ApplicationInput>(
		key: K,
		value: ApplicationInput[K]
	) => setForm((f) => ({ ...f, [key]: value }));

	const lorCount = useMemo(
		() => unis?.find((u) => u.id === form.university_id)?.lor_count ?? 0,
		[unis, form.university_id]
	);

	// Default the enum-backed selects once options arrive (create mode only).
	useEffect(() => {
		if (!initial && !form.application_type && typeEnum?.length)
			set("application_type", typeEnum[0]);
	}, [typeEnum, initial, form.application_type]);
	useEffect(() => {
		if (!initial && !form.application_status && statusEnum?.length)
			set("application_status", statusEnum[0]);
	}, [statusEnum, initial, form.application_status]);

	const handleUniversityChange = (id: string) => {
		// Changing university resets dependent selections.
		setForm((f) => ({
			...f,
			university_id: id,
			shortlisted_faculties_id: [],
			recommenders_id: [],
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!form.university_id) {
			toast.error("Please choose a university first.");
			return;
		}
		const faculties = form.shortlisted_faculties_id.filter(Boolean);
		const recommenders = form.recommenders_id.filter(Boolean);
		if (new Set(faculties).size !== faculties.length) {
			toast.error("Duplicated faculties aren't allowed.");
			return;
		}
		if (new Set(recommenders).size !== recommenders.length) {
			toast.error("Duplicated recommenders aren't allowed.");
			return;
		}
		const payload: ApplicationInput = {
			...form,
			shortlisted_faculties_id: faculties,
			recommenders_id: recommenders,
		};
		if (initial?.id) await update.mutateAsync({ ...payload, id: initial.id });
		else await create.mutateAsync(payload);
		onSubmitted();
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-6">
			<FormSection label="The application" first>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Field label="University" htmlFor="app-uni">
						<Select
							id="app-uni"
							value={form.university_id}
							onChange={(e) => handleUniversityChange(e.target.value)}
						>
							<option value="">Select a university</option>
							{(unis ?? []).map((u) => (
								<option key={u.id} value={u.id}>
									{u.name}
								</option>
							))}
						</Select>
					</Field>
					<Field label="Type" htmlFor="app-type">
						<Select
							id="app-type"
							value={form.application_type}
							onChange={(e) => set("application_type", e.target.value)}
						>
							{(typeEnum ?? []).map((t) => (
								<option key={t} value={t}>
									{t}
								</option>
							))}
						</Select>
					</Field>
				</div>
				<Field label="Status" htmlFor="app-status">
					<Select
						id="app-status"
						value={form.application_status}
						onChange={(e) => set("application_status", e.target.value)}
					>
						{(statusEnum ?? []).map((s) => (
							<option key={s} value={s}>
								{s}
							</option>
						))}
					</Select>
				</Field>
			</FormSection>

			<FormSection label="People">
				<RepeatingSelect
					label="Shortlisted faculties"
					addLabel="Add faculty"
					values={form.shortlisted_faculties_id}
					options={(facs ?? []).map((f) => ({ id: f.id, name: f.name }))}
					onChange={(v) => set("shortlisted_faculties_id", v)}
					emptyHint={
						form.university_id
							? "None added yet."
							: "Choose a university to see its faculties."
					}
				/>
				<RepeatingSelect
					label={`Recommenders${lorCount ? ` (${lorCount} needed)` : ""}`}
					addLabel="Add recommender"
					values={form.recommenders_id}
					max={lorCount}
					options={(recs ?? []).map((r) => ({ id: r.id, name: r.name }))}
					onChange={(v) => set("recommenders_id", v)}
				/>
			</FormSection>

			<FormSection label="Scores submitted">
				<div className="divide-y divide-line-hair">
					<SwitchRow
						id="app-lang"
						label="Language score"
						tone="sage"
						checked={Boolean(form.language_score_submitted)}
						onCheckedChange={(v) => set("language_score_submitted", v)}
					/>
					<SwitchRow
						id="app-gre"
						label="GRE"
						tone="sage"
						checked={Boolean(form.gre_submitted)}
						onCheckedChange={(v) => set("gre_submitted", v)}
					/>
					<SwitchRow
						id="app-gmat"
						label="GMAT"
						tone="sage"
						checked={Boolean(form.gmat_submitted)}
						onCheckedChange={(v) => set("gmat_submitted", v)}
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
				saveLabel={initial ? "Save changes" : "Save application"}
				onCancel={onCancel}
			/>
		</form>
	);
}
