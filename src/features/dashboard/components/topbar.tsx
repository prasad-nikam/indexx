"use client";

import { Command, Menu, Moon, Search, Settings2, Sun, X } from "lucide-react";

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
		<header className="sticky top-0 z-30 flex h-[62px] items-center gap-3 border-b border-line bg-surface/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
			<button
				type="button"
				onClick={onOpenMenu}
				aria-label="Open navigation"
				className="grid size-9 shrink-0 place-items-center rounded-lg text-ink-soft transition hover:bg-surface-muted hover:text-ink lg:hidden"
			>
				<Menu size={19} strokeWidth={1.8} />
			</button>

			<div className="hidden items-center gap-2 text-[11px] text-ink-subtle md:flex">
				<span className="font-medium text-ink">Workspace</span>
				<span aria-hidden="true" className="text-line-strong">
					/
				</span>
				<span>Personal index</span>
			</div>

			<div className="relative ml-0 flex w-full max-w-[420px] items-center md:ml-auto md:mr-2">
				<Search
					size={15}
					strokeWidth={1.8}
					aria-hidden="true"
					className="pointer-events-none absolute left-3.5 text-ink-subtle"
				/>
				<input
					type="search"
					value={search}
					onChange={(event) => onSearchChange(event.target.value)}
					placeholder="Search your index"
					aria-label="Search content"
					className="h-9 w-full rounded-[10px] border border-line bg-canvas/70 pl-10 pr-16 text-[12px] text-ink outline-none transition placeholder:text-ink-subtle hover:border-line-strong focus:border-accent/60 focus:bg-surface focus:ring-2 focus:ring-accent/10"
				/>

				{search ? (
					<button
						type="button"
						onClick={() => onSearchChange("")}
						aria-label="Clear search"
						className="absolute right-2 grid size-6 place-items-center rounded-md text-ink-subtle transition hover:bg-surface-muted hover:text-ink"
					>
						<X size={14} />
					</button>
				) : (
					<span className="absolute right-2 hidden h-6 items-center gap-1 rounded-md border border-line bg-surface px-1.5 text-[9px] text-ink-subtle sm:flex">
						<Command size={10} strokeWidth={1.7} />
						<span>K</span>
					</span>
				)}
			</div>

			<div className="ml-auto flex shrink-0 items-center gap-1 md:ml-0">
				<button
					type="button"
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
					{darkMode ? (
						<Sun size={17} strokeWidth={1.8} />
					) : (
						<Moon size={17} strokeWidth={1.8} />
					)}
				</button>

				<span className="mx-1 hidden h-5 w-px bg-line sm:block" />

				<button
					type="button"
					onClick={onOpenSettings}
					aria-label="Open preferences"
					title="Preferences"
					className="grid size-9 place-items-center rounded-lg text-ink-soft transition hover:bg-surface-muted hover:text-ink"
				>
					<Settings2 size={17} strokeWidth={1.8} />
				</button>
			</div>
		</header>
	);
}
