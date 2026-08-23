import { cn } from "@/lib/cn";
import { Card } from "./Card";

export interface Column<T> {
	key: string;
	header: string;
	render: (row: T) => React.ReactNode;
	/** Extra classes for alignment (e.g. "justify-end text-right"). */
	className?: string;
}

interface DataTableProps<T> {
	columns: Column<T>[];
	data: T[];
	/** CSS grid-template-columns for the desktop layout. */
	gridTemplate: string;
	rowKey: (row: T) => string;
	onRowClick?: (row: T) => void;
	/** Stacked-card renderer used below 720px. */
	renderMobileCard: (row: T) => React.ReactNode;
}

/**
 * A quiet grid table: micro-label headers, hairline row dividers, no shadow.
 * Collapses to stacked cards under 720px.
 */
export function DataTable<T>({
	columns,
	data,
	gridTemplate,
	rowKey,
	onRowClick,
	renderMobileCard,
}: DataTableProps<T>) {
	return (
		<>
			{/* Desktop / tablet: grid table */}
			<Card className="hidden overflow-hidden min-[720px]:block">
				<div
					className="grid items-center border-b border-line-soft px-[22px] py-[13px]"
					style={{ gridTemplateColumns: gridTemplate, columnGap: 16 }}
				>
					{columns.map((col) => (
						<div key={col.key} className={cn("micro-label", col.className)}>
							{col.header}
						</div>
					))}
				</div>
				{data.map((row) => (
					<div
						key={rowKey(row)}
						onClick={onRowClick ? () => onRowClick(row) : undefined}
						className={cn(
							"grid items-center px-[22px] py-[17px] border-b border-line-hair last:border-b-0",
							onRowClick && "cursor-pointer transition-colors hover:bg-paper-sunken"
						)}
						style={{ gridTemplateColumns: gridTemplate, columnGap: 16 }}
					>
						{columns.map((col) => (
							<div
								key={col.key}
								className={cn("min-w-0 text-[13.5px] text-ink-muted", col.className)}
							>
								{col.render(row)}
							</div>
						))}
					</div>
				))}
			</Card>

			{/* Mobile: stacked cards */}
			<div className="flex flex-col gap-3 min-[720px]:hidden">
				{data.map((row) => (
					<div key={rowKey(row)}>{renderMobileCard(row)}</div>
				))}
			</div>
		</>
	);
}
