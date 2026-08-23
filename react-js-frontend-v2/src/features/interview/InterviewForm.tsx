import { useState } from "react";
import { Field } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { SwitchRow } from "@/components/ui/Switch";
import { FormSection, FormFooter } from "@/features/shared/FormParts";
import { interviews, faculties } from "@/features/queries";
import { toast } from "@/lib/toast";
import { toDateInputValue, fromDateInputValue } from "@/lib/format";
import type { InterviewInput } from "@/lib/api";
import type { Interview } from "@/types";
import { isYes } from "@/types";

interface Props {
	initial?: Interview | null;
	onSubmitted: () => void;
	onCancel: () => void;
}

// Backend stores time as "hh:mm AM/PM" (e.g. "03:00 PM").
function parseTime(time?: string) {
	const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time?.trim() ?? "");
	if (!m) return { hour: "10", minute: "00", ampm: "AM" };
	return {
		hour: m[1].padStart(2, "0"),
		minute: m[2],
		ampm: m[3].toUpperCase(),
	};
}

const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

export function InterviewForm({ initial, onSubmitted, onCancel }: Props) {
	const [facultyId, setFacultyId] = useState(initial?.faculty_id ?? "");
	const [date, setDate] = useState(toDateInputValue(initial?.date));
	const [time, setTime] = useState(() => parseTime(initial?.time));
	const [completed, setCompleted] = useState(isYes(initial?.is_completed));
	const [remarks, setRemarks] = useState(initial?.remarks ?? "");

	const { data: facultyList } = faculties.useList();
	const create = interviews.useCreate();
	const update = interviews.useUpdate();
	const saving = create.isPending || update.isPending;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!facultyId) {
			toast.error("Please choose a faculty first.");
			return;
		}
		const payload: InterviewInput = {
			faculty_id: facultyId,
			date: fromDateInputValue(date),
			time: `${time.hour}:${time.minute} ${time.ampm}`,
			is_completed: completed,
			remarks,
		};
		if (initial?.id) await update.mutateAsync({ ...payload, id: initial.id });
		else await create.mutateAsync(payload);
		onSubmitted();
	};

	const timeSelect =
		"rounded-control border border-line-field bg-field px-2.5 py-[11px] text-[13.5px] text-ink-strong focus:border-clay focus:outline-none";

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-6">
			<FormSection label="When & who" first>
				<Field label="Faculty" htmlFor="int-fac">
					<Select
						id="int-fac"
						value={facultyId}
						onChange={(e) => setFacultyId(e.target.value)}
					>
						<option value="">Select a faculty</option>
						{(facultyList ?? []).map((f) => (
							<option key={f.id} value={f.id}>
								{f.name}
							</option>
						))}
					</Select>
				</Field>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<Field label="Date" htmlFor="int-date">
						<Input
							id="int-date"
							type="date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
						/>
					</Field>
					<Field label="Time">
						<div className="flex items-center gap-2">
							<select
								aria-label="Hour"
								className={timeSelect}
								value={time.hour}
								onChange={(e) => setTime((t) => ({ ...t, hour: e.target.value }))}
							>
								{hours.map((h) => (
									<option key={h}>{h}</option>
								))}
							</select>
							<span className="text-ink-faint">:</span>
							<select
								aria-label="Minute"
								className={timeSelect}
								value={time.minute}
								onChange={(e) =>
									setTime((t) => ({ ...t, minute: e.target.value }))
								}
							>
								{minutes.map((mm) => (
									<option key={mm}>{mm}</option>
								))}
							</select>
							<select
								aria-label="AM or PM"
								className={timeSelect}
								value={time.ampm}
								onChange={(e) => setTime((t) => ({ ...t, ampm: e.target.value }))}
							>
								<option>AM</option>
								<option>PM</option>
							</select>
						</div>
					</Field>
				</div>
				<SwitchRow
					id="int-done"
					label="Already completed"
					tone="sage"
					checked={completed}
					onCheckedChange={setCompleted}
				/>
			</FormSection>

			<FormSection label="Notes">
				<Textarea
					value={remarks}
					rows={3}
					placeholder="How did it go, or what to prepare…"
					onChange={(e) => setRemarks(e.target.value)}
				/>
			</FormSection>

			<FormFooter
				saving={saving}
				saveLabel={initial ? "Save changes" : "Save interview"}
				onCancel={onCancel}
			/>
		</form>
	);
}
