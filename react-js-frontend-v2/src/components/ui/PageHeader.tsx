interface PageHeaderProps {
	title: string;
	subtitle?: string;
	actions?: React.ReactNode;
}

/** Page title (Newsreader) + calm subtitle, with optional right-aligned actions. */
export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
			<div>
				<h1 className="font-serif text-[26px] leading-tight text-ink">
					{title}
				</h1>
				{subtitle && (
					<p className="mt-1 max-w-[560px] text-[14px] text-ink-soft">
						{subtitle}
					</p>
				)}
			</div>
			{actions && (
				<div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>
			)}
		</div>
	);
}
