"use client";

import { Bookmark, Layers3, Settings2, TrendingUp, X } from "lucide-react";

export type DashboardSection = "For you" | "Trending" | "Saved" | "Settings";

interface SidebarProps {
	activeSection: DashboardSection;
	onNavigate: (section: DashboardSection) => void;
	mobileOpen: boolean;
	onClose: () => void;
	savedCount: number;
}

const navigation: {
	label: DashboardSection;
	icon: typeof Layers3;
	description: string;
}[] = [
	{
		label: "For you",
		icon: Layers3,
		description: "Your personalized feed",
	},
	{
		label: "Trending",
		icon: TrendingUp,
		description: "Explore what's gaining attention",
	},
	{
		label: "Saved",
		icon: Bookmark,
		description: "Your saved items",
	},
];

export function Sidebar({
	activeSection,
	onNavigate,
	mobileOpen,
	onClose,
	savedCount,
}: SidebarProps) {
	const navigate = (section: DashboardSection) => {
		onNavigate(section);
		onClose();
	};

	return (
		<>
			{mobileOpen && (
				<button
					type="button"
					aria-label="Close navigation overlay"
					onClick={onClose}
					className="fixed inset-0 z-40 bg-[#171a16]/40 backdrop-blur-[2px] lg:hidden"
				/>
			)}

			<aside
				aria-label="Application navigation"
				className={[
					"fixed inset-y-0 left-0 z-50 flex h-dvh w-[264px] flex-col",
					"border-r border-line bg-surface px-4 py-4",
					"transition-transform duration-200 ease-out",
					"lg:sticky lg:top-0 lg:z-20 lg:h-full lg:w-[224px] lg:shrink-0",
					mobileOpen
						? "translate-x-0"
						: "-translate-x-full lg:translate-x-0",
				].join(" ")}
			>
				<div className="flex h-11 w-full items-center justify-between">
					<button
						type="button"
						onClick={() => navigate("For you")}
						aria-label="Index home"
						title="Index home"
						className="group flex items-center gap-2.5 rounded-lg text-left outline-offset-4"
					>
						<span className="grid size-9 shrink-0 place-items-center rounded-xl bg-ink text-white transition-transform duration-200 group-hover:rotate-[-4deg]">
							<Layers3 size={17} strokeWidth={2.1} />
						</span>
						<span className="text-[17px] font-semibold tracking-[-0.8px] text-ink">
							index<span className="text-accent">.</span>
						</span>
					</button>

					<button
						type="button"
						onClick={onClose}
						aria-label="Close navigation"
						className="grid size-9 place-items-center rounded-lg text-ink-soft transition hover:bg-surface-muted hover:text-ink lg:hidden"
					>
						<X size={18} strokeWidth={1.8} />
					</button>
				</div>

				<div className="mt-10 w-full px-2">
					<div className="h-px w-full bg-line" />
				</div>

				<nav
					aria-label="Main navigation"
					className="mt-5 flex w-full flex-col gap-1"
				>
					{navigation.map(({ label, icon: Icon, description }) => {
						const active = activeSection === label;

						return (
							<button
								key={label}
								type="button"
								onClick={() => navigate(label)}
								aria-current={active ? "page" : undefined}
								title={description}
								className={[
									"group relative flex h-11 w-full items-center gap-3 rounded-xl px-3",
									"text-[13px] font-medium transition-colors duration-150",
									active
										? "bg-accent-soft text-accent-ink"
										: "text-ink-soft hover:bg-surface-muted hover:text-ink",
								].join(" ")}
							>
								{active && (
									<span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-accent" />
								)}

								<Icon
									size={18}
									strokeWidth={active ? 2.15 : 1.7}
									className={[
										"shrink-0 transition-colors",
										active
											? "text-accent"
											: "text-ink-subtle group-hover:text-ink",
									].join(" ")}
								/>

								<span className="flex-1 text-left">
									{label}
								</span>

								{label === "Saved" && savedCount > 0 && (
									<span className="inline-flex rounded-md bg-surface-muted px-1.5 py-0.5 text-[10px] tabular-nums text-ink-soft">
										{savedCount}
									</span>
								)}
							</button>
						);
					})}
				</nav>

				<div className="mt-5 w-full border-t border-line pt-4">
					<button
						type="button"
						onClick={() => navigate("Settings")}
						aria-current={
							activeSection === "Settings" ? "page" : undefined
						}
						title="Preferences"
						className={[
							"group relative flex h-11 w-full items-center gap-3 rounded-xl px-3",
							"text-[13px] font-medium transition-colors duration-150",
							activeSection === "Settings"
								? "bg-accent-soft text-accent-ink"
								: "text-ink-soft hover:bg-surface-muted hover:text-ink",
						].join(" ")}
					>
						{activeSection === "Settings" && (
							<span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-accent" />
						)}

						<Settings2
							size={18}
							strokeWidth={
								activeSection === "Settings" ? 2.1 : 1.7
							}
							className={
								activeSection === "Settings"
									? "text-accent"
									: "text-ink-subtle group-hover:text-ink"
							}
						/>

						<span className="flex-1 text-left">Preferences</span>
					</button>
				</div>

				<div className="mt-auto flex w-full items-center gap-3 border-t border-line px-1 pt-4">
					<div
						aria-label="Prasad Nikam"
						title="Prasad Nikam"
						className="grid size-9 shrink-0 place-items-center rounded-full border border-line bg-surface-muted text-[10px] font-semibold tracking-[0.02em] text-ink-soft"
					>
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

					<span className="mr-1 size-1.5 shrink-0 rounded-full bg-success" />
				</div>
			</aside>
		</>
	);
}
