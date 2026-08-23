import { useState } from "react";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { FormSection, FormFooter } from "@/features/shared/FormParts";
import { recommenders } from "@/features/queries";
import type { RecommenderInput } from "@/lib/api";
import type { Recommender } from "@/types";

interface Props {
	initial?: Recommender | null;
	onSubmitted: () => void;
	onCancel: () => void;
}

const makeInitial = (r?: Recommender | null): RecommenderInput => ({
	name: r?.name ?? "",
	email: r?.email ?? "",
	designation: r?.designation ?? "",
	institution: r?.institution ?? "",
	relationship: r?.relationship ?? "",
});

export function RecommenderForm({ initial, onSubmitted, onCancel }: Props) {
	const [form, setForm] = useState<RecommenderInput>(() => makeInitial(initial));
	const create = recommenders.useCreate();
	const update = recommenders.useUpdate();
	const saving = create.isPending || update.isPending;
	const set = (key: keyof RecommenderInput, value: string) =>
		setForm((f) => ({ ...f, [key]: value }));

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (initial?.id) await update.mutateAsync({ ...form, id: initial.id });
		else await create.mutateAsync(form);
		onSubmitted();
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-6">
			<FormSection label="Their details" first>
				<Field label="Name" htmlFor="rec-name">
					<Input
						id="rec-name"
						value={form.name}
						required
						onChange={(e) => set("name", e.target.value)}
					/>
				</Field>
				<Field label="Email" htmlFor="rec-email">
					<Input
						id="rec-email"
						type="email"
						value={form.email}
						required
						onChange={(e) => set("email", e.target.value)}
					/>
				</Field>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Field label="Designation" htmlFor="rec-desg">
						<Input
							id="rec-desg"
							value={form.designation}
							onChange={(e) => set("designation", e.target.value)}
						/>
					</Field>
					<Field label="Institution" htmlFor="rec-inst">
						<Input
							id="rec-inst"
							value={form.institution}
							onChange={(e) => set("institution", e.target.value)}
						/>
					</Field>
				</div>
				<Field label="Relationship" htmlFor="rec-rel" hint="e.g. Thesis advisor">
					<Input
						id="rec-rel"
						value={form.relationship}
						onChange={(e) => set("relationship", e.target.value)}
					/>
				</Field>
			</FormSection>

			<FormFooter
				saving={saving}
				saveLabel={initial ? "Save changes" : "Save recommender"}
				onCancel={onCancel}
			/>
		</form>
	);
}
