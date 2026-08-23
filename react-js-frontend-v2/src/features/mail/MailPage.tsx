import { useMemo } from "react";
import { Plus, Check } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { StatusPill } from "@/components/ui/StatusPill";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { RowActions } from "@/components/ui/RowActions";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading, ErrorState } from "@/features/shared/PageState";
import { useFormDialog } from "@/features/shared/useFormDialog";
import { mails, faculties } from "@/features/queries";
import { isYes, type Mail } from "@/types";
import { MailForm } from "./MailForm";

const GRID = "2fr .8fr .8fr 1.1fr 1fr 40px";

const SageCheck = () => (
	<span className="inline-flex items-center gap-1 text-sage">
		<Check size={15} />
	</span>
);
const Pending = ({ label }: { label: string }) => (
	<span className="text-[12.5px] text-amber-ink">{label}</span>
);
const Dash = () => <span className="text-ink-faint">—</span>;

function vibeTone(vibe: string) {
	const v = vibe.toLowerCase();
	if (/warm|encourag|positive/.test(v)) return "sage" as const;
	return "stone" as const;
}

export function MailPage() {
	const { data, isLoading, isError, refetch } = mails.useList();
	const { data: facultyList } = faculties.useList();
	const remove = mails.useRemove();
	const dialog = useFormDialog<Mail>();

	const facultyName = useMemo(() => {
		const map = new Map<string, string>();
		(facultyList ?? []).forEach((f) => map.set(f.id, f.name));
		return map;
	}, [facultyList]);

	const nameOf = (m: Mail) =>
		m.faculty_name || facultyName.get(m.faculty_id) || "—";

	const columns: Column<Mail>[] = [
		{
			key: "faculty",
			header: "Faculty",
			render: (m) => (
				<span className="truncate text-[14.5px] font-bold text-ink-strong">
					{nameOf(m)}
				</span>
			),
		},
		{
			key: "sent",
			header: "Sent",
			render: (m) => (isYes(m.is_mailed) ? <SageCheck /> : <Pending label="Draft" />),
		},
		{
			key: "reply",
			header: "Reply",
			render: (m) =>
				isYes(m.is_mail_replied) ? <SageCheck /> : <Pending label="Waiting" />,
		},
		{
			key: "vibe",
			header: "Vibe",
			render: (m) =>
				m.reply_vibe ? (
					<StatusPill tone={vibeTone(m.reply_vibe)}>{m.reply_vibe}</StatusPill>
				) : (
					<Dash />
				),
		},
		{
			key: "interview",
			header: "Interview",
			render: (m) =>
				isYes(m.is_interview_requested) ? (
					<span className="font-semibold text-sage">Invited</span>
				) : (
					<Dash />
				),
		},
		{
			key: "actions",
			header: "",
			className: "justify-self-end",
			render: (m) => (
				<RowActions
					onEdit={() => dialog.openEdit(m)}
					onDelete={() => remove.mutate(m.id)}
				/>
			),
		},
	];

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title="Mails"
				subtitle="Where each conversation stands. No pressure to hear back."
				actions={
					<Button onClick={dialog.openCreate}>
						<Plus size={16} /> Log an email
					</Button>
				}
			/>

			{isLoading ? (
				<Loading />
			) : isError ? (
				<ErrorState onRetry={() => refetch()} />
			) : !data?.length ? (
				<Card className="border-dashed">
					<EmptyState
						title="No emails logged yet"
						body="When you reach out to a professor, note it here so you can see where every conversation stands."
						action={
							<Button onClick={dialog.openCreate}>
								<Plus size={16} /> Log your first email
							</Button>
						}
					/>
				</Card>
			) : (
				<DataTable
					columns={columns}
					data={data}
					gridTemplate={GRID}
					rowKey={(m) => m.id}
					renderMobileCard={(m) => (
						<Card className="p-4">
							<div className="flex items-start justify-between gap-2">
								<p className="text-[15px] font-bold text-ink-strong">
									{nameOf(m)}
								</p>
								<RowActions
									onEdit={() => dialog.openEdit(m)}
									onDelete={() => remove.mutate(m.id)}
								/>
							</div>
							<div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12.5px] text-ink-muted">
								<span className="flex items-center gap-1.5">
									Sent{" "}
									{isYes(m.is_mailed) ? <SageCheck /> : <Pending label="Draft" />}
								</span>
								<span className="flex items-center gap-1.5">
									Reply{" "}
									{isYes(m.is_mail_replied) ? (
										<SageCheck />
									) : (
										<Pending label="Waiting" />
									)}
								</span>
								{m.reply_vibe && (
									<StatusPill tone={vibeTone(m.reply_vibe)}>
										{m.reply_vibe}
									</StatusPill>
								)}
								{isYes(m.is_interview_requested) && (
									<span className="font-semibold text-sage">Invited</span>
								)}
							</div>
						</Card>
					)}
				/>
			)}

			<Dialog
				open={dialog.open}
				onOpenChange={(o) => (o ? dialog.setOpen(true) : dialog.close())}
				title={dialog.editing ? "Edit email" : "Log an email"}
				description="Track where a conversation stands."
			>
				<MailForm
					initial={dialog.editing}
					onSubmitted={dialog.close}
					onCancel={dialog.close}
				/>
			</Dialog>
		</div>
	);
}
