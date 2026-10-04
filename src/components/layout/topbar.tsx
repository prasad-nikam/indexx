"use client";

import {
	Bell,
	Command,
	Menu,
	Moon,
	Search,
	Settings2,
	Sun,
	X,
} from "lucide-react";

interface TopbarProps {
	search: string;
	onSearchChange: (value: string) => void;
	darkMode: boolean;
	onToggleTheme: () => void;
	onOpenMenu: () => void;
	onOpenSettings: () => void;
}

export function Topbar({
	search,
	onSearchChange,
	darkMode,
	onToggleTheme,
	onOpenMenu,
	onOpenSettings,
}: TopbarProps) {
	return (
		<header className="sticky top-0 z-30 flex h-[68px] items-center gap-3 border-b border-line bg-surface/90 px-4 backdrop-blur-xl sm:px-6 lg:px-9">
			<button
				onClick={onOpenMenu}
				aria-label="Open navigation"
				className="grid size-9 shrink-0 place-items-center rounded-lg text-ink-soft hover:bg-surface-muted md:hidden"
			>
				<Menu size={19} />
			</button>

			<div className="relative flex w-full max-w-[440px] items-center">
				<Search
					size={16}
					className="pointer-events-none absolute left-3.5 text-ink-subtle"
				/>
				<input
					value={search}
					onChange={(event) => onSearchChange(event.target.value)}
					placeholder="Search anything..."
					aria-label="Search content"
					className="h-10 w-full rounded-lg border border-line bg-surface-muted/70 pl-10 pr-16 text-[12px] text-ink outline-none transition placeholder:text-ink-subtle focus:border-accent/50 focus:bg-surface focus:ring-2 focus:ring-accent/10"
				/>
				{search ? (
					<button
						onClick={() => onSearchChange("")}
						aria-label="Clear search"
						className="absolute right-2.5 grid size-6 place-items-center rounded text-ink-subtle hover:bg-surface-muted hover:text-ink"
					>
						<X size={14} />
					</button>
				) : (
					<span className="absolute right-2.5 hidden items-center gap-1 rounded border border-line bg-surface px-1.5 py-1 text-[9px] text-ink-subtle sm:flex">
						<Command size={10} /> K
					</span>
				)}
			</div>

			<div className="ml-auto flex shrink-0 items-center gap-1.5">
				<button
					onClick={onToggleTheme}
					aria-label={
						darkMode
							? "Switch to light mode"
							: "Switch to dark mode"
					}
					title={
						darkMode
							? "Switch to light mode"
							: "Switch to dark mode"
					}
					className="grid size-9 place-items-center rounded-lg text-ink-soft transition hover:bg-surface-muted hover:text-ink"
				>
					{darkMode ? <Sun size={17} /> : <Moon size={17} />}
				</button>

				<button
					aria-label="Notifications"
					title="Notifications"
					className="relative grid size-9 place-items-center rounded-lg text-ink-soft transition hover:bg-surface-muted hover:text-ink"
				>
					<Bell size={17} />
					<span className="absolute right-[9px] top-[8px] size-1.5 rounded-full border border-surface bg-accent" />
				</button>

				<span className="mx-1 hidden h-6 w-px bg-line sm:block" />

				<button
					onClick={onOpenSettings}
					className="flex size-9 items-center justify-center rounded-lg text-ink-soft transition hover:bg-surface-muted hover:text-ink sm:hidden"
					aria-label="Open preferences"
				>
					<Settings2 size={17} />
				</button>

				<button
					onClick={onOpenSettings}
					className="hidden h-9 items-center gap-2 rounded-lg border border-line px-3 text-[11px] font-medium text-ink-soft transition hover:bg-surface-muted hover:text-ink sm:flex"
				>
					<Settings2 size={14} />
					Preferences
				</button>
			</div>
		</header>
	);
}
