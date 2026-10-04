"use client";

import {
	Bookmark,
	Compass,
	Layers3,
	Settings2,
	Sparkles,
	TrendingUp,
	X,
} from "lucide-react";

export type DashboardSection = "For you" | "Trending" | "Saved" | "Settings";

interface SidebarProps {
	activeSection: DashboardSection;
	onNavigate: (section: DashboardSection) => void;
	mobileOpen: boolean;
	onClose: () => void;
}

const navigation: {
	label: DashboardSection;
	icon: typeof Compass;
}[] = [
	{ label: "For you", icon: Layers3 },
	{ label: "Trending", icon: TrendingUp },
	{ label: "Saved", icon: Bookmark },
];

export function Sidebar({
	activeSection,
	onNavigate,
	mobileOpen,
	onClose,
}: SidebarProps) {
	return (
		<>
			{mobileOpen && (
				<button
					aria-label="Close navigation overlay"
					onClick={onClose}
					className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] md:hidden"
				/>
			)}

			<aside
				className={`fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col border-r border-line bg-surface px-4 py-5 transition-transform duration-200 md:sticky md:top-0 md:z-20 md:h-screen md:translate-x-0 ${
					mobileOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex h-10 items-center justify-between px-2">
					<button
						onClick={() => onNavigate("For you")}
						className="flex items-center gap-2.5 rounded-md text-left"
						aria-label="Index home"
					>
						<span className="grid size-8 place-items-center rounded-[10px] bg-ink text-white">
							<Layers3 size={17} strokeWidth={2.2} />
						</span>
						<span className="text-[17px] font-semibold tracking-[-0.6px] text-ink">
							index<span className="text-accent">.</span>
						</span>
					</button>
					<button
						onClick={onClose}
						aria-label="Close navigation"
						className="grid size-8 place-items-center rounded-lg text-ink-soft hover:bg-surface-muted md:hidden"
					>
						<X size={18} />
					</button>
				</div>

				<div className="mt-10 px-3">
					<p className="text-[10px] font-semibold uppercase tracking-[1.5px] text-ink-subtle">
						Workspace
					</p>
				</div>

				<nav
					aria-label="Main navigation"
					className="mt-3 flex flex-col gap-1"
				>
					{navigation.map(({ label, icon: Icon }) => {
						const active = activeSection === label;

						return (
							<button
								key={label}
								onClick={() => {
									onNavigate(label);
									onClose();
								}}
								aria-current={active ? "page" : undefined}
								className={`group flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors ${
									active
										? "bg-accent-soft text-accent-ink"
										: "text-ink-soft hover:bg-surface-muted hover:text-ink"
								}`}
							>
								<Icon
									size={17}
									strokeWidth={active ? 2.2 : 1.8}
									className={
										active
											? "text-accent"
											: "text-ink-subtle"
									}
								/>
								<span>{label}</span>
								{label === "Saved" && (
									<span className="ml-auto rounded-md bg-surface-muted px-1.5 py-0.5 text-[10px] text-ink-subtle">
										0
									</span>
								)}
							</button>
						);
					})}
				</nav>

				<div className="mt-8 px-3">
					<p className="text-[10px] font-semibold uppercase tracking-[1.5px] text-ink-subtle">
						Personalize
					</p>
				</div>

				<nav
					aria-label="Personalization"
					className="mt-3 flex flex-col gap-1"
				>
					<button
						onClick={() => {
							onNavigate("Settings");
							onClose();
						}}
						aria-current={
							activeSection === "Settings" ? "page" : undefined
						}
						className={`flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors ${
							activeSection === "Settings"
								? "bg-accent-soft text-accent-ink"
								: "text-ink-soft hover:bg-surface-muted hover:text-ink"
						}`}
					>
						<Settings2 size={17} className="text-ink-subtle" />
						Preferences
					</button>
				</nav>

				<div className="mt-auto">
					<div className="rounded-xl border border-line bg-surface-muted/60 p-3.5">
						<div className="flex items-center gap-2">
							<span className="grid size-7 place-items-center rounded-lg bg-accent-soft text-accent">
								<Sparkles size={14} />
							</span>
							<span className="text-xs font-semibold text-ink">
								Your space, your signal
							</span>
						</div>
						<p className="mt-2 text-[11px] leading-[1.6] text-ink-soft">
							Make room for the ideas and stories worth your
							attention.
						</p>
					</div>

					<div className="mt-4 flex items-center gap-2.5 border-t border-line px-2 pt-4">
						<div className="grid size-8 place-items-center rounded-full bg-[#dce6db] text-[11px] font-semibold text-[#3c6048]">
							PN
						</div>
						<div className="min-w-0 flex-1">
							<p className="truncate text-xs font-semibold text-ink">
								Prasad Nikam
							</p>
							<p className="mt-0.5 text-[10px] text-ink-subtle">
								Personal workspace
							</p>
						</div>
						<span className="size-1.5 rounded-full bg-success" />
					</div>
				</div>
			</aside>
		</>
	);
}
