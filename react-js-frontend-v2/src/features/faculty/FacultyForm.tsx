import { useState } from "react";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Input";
import { ChipField } from "@/components/ui/ChipField";
import { FormSection, FormFooter } from "@/features/shared/FormParts";
import { faculties, universities } from "@/features/queries";
import type { FacultyInput } from "@/lib/api";
import type { Faculty } from "@/types";

interface Props {
	initial?: Faculty | null;
	onSubmitted: () => void;
	onCancel: () => void;
}

const makeInitial = (f?: Faculty | null): FacultyInput => ({
	name: f?.name ?? "",
	email: f?.email ?? "",
	university_id: f?.university_id ?? "",
	designation: f?.designation ?? "",
	research_areas: f?.research_areas ?? [],
	interested_papers: f?.interested_papers ?? [],
});

export function FacultyForm({ initial, onSubmitted, onCancel }: Props) {
	const [form, setForm] = useState<FacultyInput>(() => makeInitial(initial));
	const { data: unis } = universities.useList();
	const create = faculties.useCreate();
	const update = faculties.useUpdate();
	const saving = create.isPending || update.isPending;
	const set = <K extends keyof FacultyInput>(key: K, value: FacultyInput[K]) =>
		setForm((f) => ({ ...f, [key]: value }));

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (initial?.id) await update.mutateAsync({ ...form, id: initial.id });
		else await create.mutateAsync(form);
		onSubmitted();
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-6">
			<FormSection label="The basics" first>
				<Field label="Name" htmlFor="fac-name">
					<Input
						id="fac-name"
						value={form.name}
						required
						onChange={(e) => set("name", e.target.value)}
					/>
				</Field>
				<Field label="Email" htmlFor="fac-email">
					<Input
						id="fac-email"
						type="email"
						value={form.email}
						required
						onChange={(e) => set("email", e.target.value)}
					/>
				</Field>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Field label="University" htmlFor="fac-uni">
						<Select
							id="fac-uni"
							value={form.university_id}
							required
							onChange={(e) => set("university_id", e.target.value)}
						>
							<option value="">Select a university</option>
							{(unis ?? []).map((u) => (
								<option key={u.id} value={u.id}>
									{u.name}
								</option>
							))}
						</Select>
					</Field>
					<Field label="Designation" htmlFor="fac-desg">
						<Input
							id="fac-desg"
							value={form.designation}
							placeholder="e.g. Professor"
							onChange={(e) => set("designation", e.target.value)}
						/>
					</Field>
				</div>
			</FormSection>

			<FormSection label="Interests">
				<Field label="Research areas">
					<ChipField
						value={form.research_areas}
						onChange={(v) => set("research_areas", v)}
						placeholder="Add an area…"
					/>
				</Field>
				<Field label="Interested papers" hint="Paper titles, IDs or links">
					<ChipField
						value={form.interested_papers}
						onChange={(v) => set("interested_papers", v)}
						placeholder="Add a paper…"
					/>
				</Field>
			</FormSection>

			<FormFooter
				saving={saving}
				saveLabel={initial ? "Save changes" : "Save faculty"}
				onCancel={onCancel}
			/>
		</form>
	);
}
