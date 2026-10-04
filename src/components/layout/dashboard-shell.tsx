"use client";

import { useEffect, useMemo, useState } from "react";
import {
	ArrowDownRight,
	ArrowUpRight,
	ChevronDown,
	CircleHelp,
	Compass,
	SlidersHorizontal,
	Sparkles,
	TrendingUp,
} from "lucide-react";
import { Sidebar, type DashboardSection } from "./sidebar";
import { Topbar } from "./topbar";
import { ContentCard } from "@/components/feed/content-card";
import { mockContent, trendingTopics } from "@/lib/mock-content";

export function DashboardShell() {
	const [activeSection, setActiveSection] =
		useState<DashboardSection>("For you");
	const [search, setSearch] = useState("");
	const [darkMode, setDarkMode] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const [savedIds, setSavedIds] = useState<string[]>([]);
	const [selectedCategory, setSelectedCategory] = useState("All");

	useEffect(() => {
		const storedTheme = localStorage.getItem("index-theme");
		const storedSaved = localStorage.getItem("index-saved");

		// eslint-disable-next-line react-hooks/set-state-in-effect
		if (storedTheme === "dark") setDarkMode(true);
		if (storedSaved) {
			try {
				setSavedIds(JSON.parse(storedSaved) as string[]);
			} catch {
				localStorage.removeItem("index-saved");
			}
		}
	}, []);

	useEffect(() => {
		document.documentElement.dataset.theme = darkMode ? "dark" : "light";
		localStorage.setItem("index-theme", darkMode ? "dark" : "light");
	}, [darkMode]);

	useEffect(() => {
		localStorage.setItem("index-saved", JSON.stringify(savedIds));
	}, [savedIds]);

	const categories = useMemo(
		() => [
			"All",
			...Array.from(new Set(mockContent.map((item) => item.category))),
		],
		[],
	);

	const visibleContent = useMemo(() => {
		let items = [...mockContent];

		if (activeSection === "Saved") {
			items = items.filter((item) => savedIds.includes(item.id));
		}

		if (selectedCategory !== "All" && activeSection === "For you") {
			items = items.filter((item) => item.category === selectedCategory);
		}

		const query = search.trim().toLowerCase();
		if (query) {
			items = items.filter((item) =>
				[
					item.title,
					item.description,
					item.category,
					item.source,
					item.type,
				].some((value) => value.toLowerCase().includes(query)),
			);
		}

		return items;
	}, [activeSection, savedIds, selectedCategory, search]);

	function toggleSaved(id: string) {
		setSavedIds((current) =>
			current.includes(id)
				? current.filter((savedId) => savedId !== id)
				: [...current, id],
		);
	}

	const pageTitle = {
		"For you": "Your daily signal",
		Trending: "What’s gaining attention",
		Saved: "Your reading list",
		Settings: "Make it yours",
	}[activeSection];

	return (
		<div
			data-theme={darkMode ? "dark" : "light"}
			className="min-h-screen bg-canvas text-ink"
		>
			<div className="flex min-h-screen">
				<Sidebar
					activeSection={activeSection}
					onNavigate={setActiveSection}
					mobileOpen={mobileOpen}
					onClose={() => setMobileOpen(false)}
				/>

				<div className="min-w-0 flex-1">
					<Topbar
						search={search}
						onSearchChange={setSearch}
						darkMode={darkMode}
						onToggleTheme={() => setDarkMode((value) => !value)}
						onOpenMenu={() => setMobileOpen(true)}
						onOpenSettings={() => setActiveSection("Settings")}
					/>

					<main className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-8 sm:px-6 lg:px-9 lg:pt-10">
						<div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
							<div>
								<div className="mb-3 flex items-center gap-2">
									<span className="size-1.5 rounded-full bg-success" />
									<p className="text-[10px] font-semibold uppercase tracking-[1.5px] text-ink-subtle">
										Wednesday, September 30
									</p>
								</div>
								<h1 className="text-[28px] font-semibold tracking-[-1.2px] text-ink sm:text-[34px]">
									{pageTitle}
									<span className="text-accent">.</span>
								</h1>
								<p className="mt-2 max-w-[520px] text-[12px] leading-[1.7] text-ink-soft">
									{activeSection === "For you"
										? "A considered mix of ideas, stories, and perspectives picked for your interests."
										: activeSection === "Trending"
											? "A snapshot of topics and conversations people are exploring."
											: activeSection === "Saved"
												? "The things you’ve kept close, ready when you are."
												: "Shape your feed around what matters to you."}
								</p>
							</div>

							{activeSection === "For you" && (
								<button
									onClick={() => setActiveSection("Settings")}
									className="inline-flex h-9 shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-line bg-surface px-3 text-[11px] font-medium text-ink-soft transition hover:border-line-strong hover:text-ink sm:self-auto"
								>
									<SlidersHorizontal size={14} />
									Customize feed
								</button>
							)}
						</div>

						{activeSection === "For you" && (
							<div className="mt-8 flex flex-wrap items-center gap-2 border-b border-line pb-4">
								<span className="mr-1 text-[10px] font-medium text-ink-subtle">
									Explore
								</span>
								{categories.map((category) => {
									const active =
										selectedCategory === category;
									return (
										<button
											key={category}
											onClick={() =>
												setSelectedCategory(category)
											}
											className={`rounded-full px-3 py-1.5 text-[10px] font-medium transition ${
												active
													? "bg-ink text-white"
													: "border border-line bg-surface text-ink-soft hover:border-line-strong hover:text-ink"
											}`}
										>
											{category}
										</button>
									);
								})}
								<button className="ml-auto hidden items-center gap-1.5 rounded-md px-2 py-1.5 text-[10px] text-ink-subtle transition hover:bg-surface-muted hover:text-ink sm:flex">
									Latest <ChevronDown size={12} />
								</button>
							</div>
						)}

						{activeSection === "Settings" ? (
							<section className="mt-8 max-w-2xl rounded-xl border border-line bg-surface p-5 sm:p-7">
								<div className="flex items-start gap-3">
									<span className="grid size-9 place-items-center rounded-lg bg-accent-soft text-accent">
										<SlidersHorizontal size={17} />
									</span>
									<div>
										<h2 className="text-sm font-semibold text-ink">
											Feed preferences
										</h2>
										<p className="mt-1 text-xs leading-5 text-ink-soft">
											Personalization controls are coming
											in the next build step. Your theme
											and saved items are already stored
											in this browser.
										</p>
									</div>
								</div>
								<div className="mt-6 flex items-center justify-between border-t border-line pt-5">
									<div>
										<p className="text-xs font-medium text-ink">
											Appearance
										</p>
										<p className="mt-1 text-[11px] text-ink-subtle">
											Choose a comfortable reading theme.
										</p>
									</div>
									<button
										onClick={() =>
											setDarkMode((value) => !value)
										}
										className="rounded-lg border border-line px-3 py-2 text-[11px] font-medium text-ink-soft hover:bg-surface-muted"
									>
										{darkMode ? "Dark mode" : "Light mode"}{" "}
										· Change
									</button>
								</div>
							</section>
						) : activeSection === "Trending" ? (
							<section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
								{trendingTopics.map((topic, index) => (
									<article
										key={topic.label}
										className="rounded-xl border border-line bg-surface p-5 transition hover:border-line-strong hover:shadow-[var(--shadow-soft)]"
									>
										<div className="flex items-center justify-between">
											<span className="text-[10px] font-medium text-ink-subtle">
												0{index + 1} / TRENDING
											</span>
											<TrendingUp
												size={15}
												className="text-accent"
											/>
										</div>
										<h2 className="mt-7 text-base font-semibold tracking-[-0.3px] text-ink">
											{topic.label}
										</h2>
										<div className="mt-2 flex items-center justify-between">
											<span className="text-[11px] text-ink-subtle">
												{topic.count}
											</span>
											<ArrowUpRight
												size={15}
												className="text-ink-subtle"
											/>
										</div>
									</article>
								))}
							</section>
						) : (
							<div className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
								<section
									aria-label="Content feed"
									className="min-w-0"
								>
									{search && (
										<div className="mb-4 flex items-center justify-between">
											<p className="text-[11px] text-ink-soft">
												Results for{" "}
												<span className="font-semibold text-ink">
													“{search}”
												</span>
											</p>
											<button
												onClick={() => setSearch("")}
												className="text-[10px] font-medium text-accent hover:underline"
											>
												Clear search
											</button>
										</div>
									)}

									{visibleContent.length > 0 ? (
										<div className="flex flex-col gap-4">
											{visibleContent.map(
												(item, index) => (
													<ContentCard
														key={item.id}
														item={item}
														saved={savedIds.includes(
															item.id,
														)}
														onToggleSaved={
															toggleSaved
														}
														featured={
															index === 0 &&
															!search &&
															selectedCategory ===
																"All" &&
															activeSection ===
																"For you"
														}
													/>
												),
											)}
										</div>
									) : (
										<div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-line-strong bg-surface/50 px-6 text-center">
											<span className="grid size-11 place-items-center rounded-xl bg-surface-muted text-ink-subtle">
												<Compass size={20} />
											</span>
											<h2 className="mt-4 text-sm font-semibold text-ink">
												{activeSection === "Saved"
													? "Nothing saved just yet"
													: "No matching stories"}
											</h2>
											<p className="mt-1 max-w-[270px] text-[11px] leading-5 text-ink-subtle">
												{activeSection === "Saved"
													? "Save an article or discovery and it will be waiting here."
													: "Try another search or choose a different category."}
											</p>
											{activeSection === "Saved" && (
												<button
													onClick={() =>
														setActiveSection(
															"For you",
														)
													}
													className="mt-4 rounded-lg bg-ink px-3 py-2 text-[11px] font-medium text-white hover:opacity-85"
												>
													Explore your feed
												</button>
											)}
										</div>
									)}
								</section>

								<aside className="hidden min-w-0 flex-col gap-4 xl:flex">
									<section className="rounded-xl border border-line bg-surface p-4">
										<div className="flex items-center justify-between">
											<h2 className="text-xs font-semibold text-ink">
												Your overview
											</h2>
											<span className="text-[10px] text-ink-subtle">
												Today
											</span>
										</div>
										<div className="mt-4 grid grid-cols-2 gap-2">
											<div className="rounded-lg bg-surface-muted p-3">
												<p className="text-[10px] text-ink-subtle">
													In your feed
												</p>
												<p className="mt-1 text-xl font-semibold tracking-[-0.8px] text-ink">
													{mockContent.length
														.toString()
														.padStart(2, "0")}
												</p>
												<p className="mt-1 text-[9px] text-ink-subtle">
													Curated items
												</p>
											</div>
											<div className="rounded-lg bg-surface-muted p-3">
												<p className="text-[10px] text-ink-subtle">
													Saved
												</p>
												<p className="mt-1 text-xl font-semibold tracking-[-0.8px] text-ink">
													{savedIds.length
														.toString()
														.padStart(2, "0")}
												</p>
												<p className="mt-1 text-[9px] text-ink-subtle">
													For later
												</p>
											</div>
										</div>
									</section>

									<section className="rounded-xl border border-line bg-surface p-4">
										<div className="flex items-center justify-between">
											<h2 className="text-xs font-semibold text-ink">
												Trending now
											</h2>
											<button
												onClick={() =>
													setActiveSection("Trending")
												}
												className="text-[10px] font-medium text-accent hover:underline"
											>
												View all
											</button>
										</div>
										<div className="mt-3 divide-y divide-line">
											{trendingTopics.map(
												(topic, index) => (
													<button
														key={topic.label}
														onClick={() => {
															setSearch(
																topic.label,
															);
															setActiveSection(
																"For you",
															);
														}}
														className="flex w-full items-center gap-3 py-3 text-left"
													>
														<span className="w-4 text-[10px] tabular-nums text-ink-subtle">
															0{index + 1}
														</span>
														<span className="min-w-0 flex-1">
															<span className="block truncate text-[11px] font-medium text-ink">
																{topic.label}
															</span>
															<span className="mt-1 block text-[9px] text-ink-subtle">
																{topic.count}
															</span>
														</span>
														<ArrowUpRight
															size={13}
															className="text-ink-subtle"
														/>
													</button>
												),
											)}
										</div>
									</section>

									<section className="rounded-xl border border-accent/15 bg-accent-soft/50 p-4">
										<div className="flex items-center gap-2 text-accent-ink">
											<Sparkles size={15} />
											<h2 className="text-xs font-semibold">
												A little intention
											</h2>
										</div>
										<p className="mt-2 text-[11px] leading-[1.7] text-ink-soft">
											The goal isn’t to read everything.
											It’s to find the few things worth
											thinking about.
										</p>
									</section>
								</aside>
							</div>
						)}

						<footer className="mt-12 flex flex-col gap-2 border-t border-line pt-4 text-[10px] text-ink-subtle sm:flex-row sm:items-center sm:justify-between">
							<span>Index · A quieter way to keep up.</span>
							<span className="flex items-center gap-1.5">
								<CircleHelp size={12} />
								Built for curious minds
							</span>
						</footer>
					</main>
				</div>
			</div>
		</div>
	);
}
