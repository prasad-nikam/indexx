"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
	ArrowLeft,
	ArrowUpRight,
	Bookmark,
	BookmarkCheck,
	CircleHelp,
	Compass,
	ExternalLink,
	SlidersHorizontal,
	Sparkles,
	TrendingUp,
} from "lucide-react";

import { Sidebar, type DashboardSection } from "./sidebar";
import { Topbar } from "./topbar";
import type { ContentItem } from "@/features/content/types/content";
import { FeedPagination } from "@/features/content/components/feed-pagination";
import { trendingTopics } from "@/features/content/data/mock-content";
import { useNewsFeed } from "@/features/content/hooks/use-news-feed";

const categories = ["Technology", "Design", "Engineering", "Science"];
const SAVED_ITEMS_KEY = "index-saved-items";
const LEGACY_SAVED_KEY = "index-saved";

function formatDate(value?: string) {
	if (!value) return "Recently added";

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;

	return new Intl.DateTimeFormat("en", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(date);
}

function getTypeLabel(type?: string) {
	if (!type) return "STORY";
	return type.replaceAll("-", " ").toUpperCase();
}

export function DashboardShell() {
	const [activeSection, setActiveSection] =
		useState<DashboardSection>("For you");
	const [search, setSearch] = useState("");
	const [darkMode, setDarkMode] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
	const [savedItems, setSavedItems] = useState<ContentItem[]>([]);
	const [selectedCategory, setSelectedCategory] = useState("Technology");
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [preferencesLoaded, setPreferencesLoaded] = useState(false);

	// Preserve the mobile index position while switching to and from a story.
	const mobileReturnScrollY = useRef<number | null>(null);

	const {
		items: feedItems,
		isLoading,
		isInitialError,
		isLoadMoreError,
		hasMore,
		isFetchingMore,
		loadMore,
		retry,
		sentinelRef,
	} = useNewsFeed(selectedCategory, activeSection === "For you");

	useEffect(() => {
		const storedTheme = localStorage.getItem("index-theme");
		const storedItems = localStorage.getItem(SAVED_ITEMS_KEY);
		const legacySaved = localStorage.getItem(LEGACY_SAVED_KEY);

		// Browser preferences are hydrated after the first client render.
		// eslint-disable-next-line react-hooks/set-state-in-effect
		if (storedTheme === "dark") setDarkMode(true);

		if (storedItems) {
			try {
				const parsed = JSON.parse(storedItems) as ContentItem[];
				if (Array.isArray(parsed)) setSavedItems(parsed);
			} catch {
				localStorage.removeItem(SAVED_ITEMS_KEY);
			}
		} else if (legacySaved) {
			try {
				const ids = JSON.parse(legacySaved) as string[];
				if (Array.isArray(ids)) {
					setSavedItems(
						ids
							.filter((id) => typeof id === "string" && id)
							.map((id) => ({
								id,
								type: "news" as const,
								category: "",
								source: "",
								title: "",
								description: "",
								publishedAt: "",
							})),
					);
				}
			} catch {
				localStorage.removeItem(LEGACY_SAVED_KEY);
			}
		}

		setPreferencesLoaded(true);
	}, []);

	useEffect(() => {
		if (mobileDetailOpen || mobileReturnScrollY.current === null) return;

		window.scrollTo({
			top: mobileReturnScrollY.current,
			behavior: "auto",
		});
		mobileReturnScrollY.current = null;
	}, [mobileDetailOpen]);

	useEffect(() => {
		if (!preferencesLoaded) return;

		document.documentElement.dataset.theme = darkMode ? "dark" : "light";
		localStorage.setItem("index-theme", darkMode ? "dark" : "light");
	}, [darkMode, preferencesLoaded]);

	useEffect(() => {
		if (!preferencesLoaded) return;

		localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(savedItems));
		localStorage.setItem(
			LEGACY_SAVED_KEY,
			JSON.stringify(savedItems.map((item) => item.id)),
		);
	}, [savedItems, preferencesLoaded]);

	const visibleContent = useMemo(() => {
		let items =
			activeSection === "Saved" ? [...savedItems] : [...feedItems];

		const query = search.trim().toLowerCase();

		if (query) {
			items = items.filter((item) =>
				[
					item.title,
					item.description,
					item.category,
					item.source,
					item.type,
				].some((value) => value?.toLowerCase().includes(query)),
			);
		}

		return items;
	}, [activeSection, feedItems, savedItems, search]);

	const selectedItem =
		visibleContent.find((item) => item.id === selectedId) ??
		visibleContent[0] ??
		null;

	const isSaved = (id: string) =>
		savedItems.some((savedItem) => savedItem.id === id);

	function toggleSaved(id: string) {
		setSavedItems((current) => {
			if (current.some((item) => item.id === id)) {
				return current.filter((item) => item.id !== id);
			}

			const itemToSave =
				feedItems.find((item) => item.id === id) ??
				visibleContent.find((item) => item.id === id);

			return itemToSave ? [...current, itemToSave] : current;
		});
	}

	function navigate(section: DashboardSection) {
		setActiveSection(section);
		setMobileOpen(false);
		setMobileDetailOpen(false);
		mobileReturnScrollY.current = null;
		setSelectedId(null);

		if (section !== "For you") setSearch("");
	}

	function selectItem(item: ContentItem) {
		if (window.matchMedia("(max-width: 1023px)").matches) {
			mobileReturnScrollY.current = window.scrollY;
		}

		setSelectedId(item.id);
		setMobileDetailOpen(true);
	}

	const pageTitle = {
		"For you": "Your daily signal",
		Trending: "What’s gaining attention",
		Saved: "Your reading list",
		Settings: "Make it yours",
	}[activeSection];

	const pageDescription = {
		"For you": "A considered stream of ideas, stories, and perspectives.",
		Trending: "Topics and conversations being explored right now.",
		Saved: "A personal archive of things worth returning to.",
		Settings: "Shape your reading environment.",
	}[activeSection];

	return (
		<div
			data-theme={darkMode ? "dark" : "light"}
			className="min-h-screen bg-canvas text-ink lg:h-dvh lg:overflow-hidden"
		>
			<div className="flex min-h-screen lg:h-full lg:min-h-0">
				<Sidebar
					activeSection={activeSection}
					onNavigate={navigate}
					mobileOpen={mobileOpen}
					onClose={() => setMobileOpen(false)}
					savedCount={savedItems.length}
				/>

				<div className="min-w-0 flex-1 lg:flex lg:min-h-0 lg:flex-col">
					<Topbar
						search={search}
						onSearchChange={setSearch}
						darkMode={darkMode}
						onToggleTheme={() => setDarkMode((value) => !value)}
						onOpenMenu={() => setMobileOpen(true)}
						onOpenSettings={() => navigate("Settings")}
					/>

					<main
						className={`mx-auto w-full max-w-[1480px] min-w-0 px-4 pb-12 sm:px-6 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-hidden lg:px-9 lg:pb-5 lg:pt-6 ${
							mobileDetailOpen ? "pt-2 sm:pt-3" : "pt-7"
						}`}
					>
						<header
							className={`${
								mobileDetailOpen ? "hidden lg:flex" : "flex"
							} mb-0 shrink-0 flex-col justify-between gap-5 pb-6 sm:flex-row sm:items-end`}
						>
							<div>
								<div className="mb-3 flex items-center gap-2">
									<span className="size-1.5 rounded-full bg-success" />
									<p className="text-[10px] font-semibold uppercase tracking-[1.5px] text-ink-subtle">
										INDEX / PERSONAL LIBRARY
									</p>
								</div>

								<h1 className="text-[29px] font-semibold tracking-[-1.2px] text-ink sm:text-[35px]">
									{pageTitle}
									<span className="text-accent">.</span>
								</h1>

								<p className="mt-2 max-w-[500px] text-[13px] leading-6 text-ink-soft">
									{pageDescription}
								</p>
							</div>

							{activeSection === "For you" && (
								<button
									type="button"
									onClick={() => navigate("Settings")}
									className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-lg border border-line bg-surface px-3 text-xs font-medium text-ink-soft transition hover:border-line-strong hover:text-ink sm:self-auto"
								>
									<SlidersHorizontal size={14} />
									Feed preferences
								</button>
							)}
						</header>

						{activeSection === "Settings" ? (
							<section className="max-w-2xl border-y border-line lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
								<div className="flex items-start gap-4 py-6">
									<span className="grid size-9 shrink-0 place-items-center rounded-lg bg-surface-muted text-ink-soft">
										<SlidersHorizontal size={17} />
									</span>

									<div>
										<h2 className="text-sm font-semibold text-ink">
											Reading preferences
										</h2>
										<p className="mt-1 text-[13px] leading-6 text-ink-soft">
											Your theme and saved items are
											stored in this browser. More feed
											customization controls can be added
											here as the preference model
											evolves.
										</p>
									</div>
								</div>

								<div className="flex items-center justify-between gap-4 border-t border-line py-5">
									<div>
										<p className="text-[13px] font-medium text-ink">
											Appearance
										</p>
										<p className="mt-1 text-xs text-ink-subtle">
											Choose a comfortable reading theme.
										</p>
									</div>

									<button
										type="button"
										onClick={() =>
											setDarkMode((value) => !value)
										}
										className="min-h-11 rounded-lg border border-line px-3 py-2 text-xs font-medium text-ink-soft transition hover:bg-surface-muted"
									>
										{darkMode
											? "Dark mode · Change"
											: "Light mode · Change"}
									</button>
								</div>

								<div className="flex items-center justify-between gap-4 border-t border-line py-5">
									<div>
										<p className="text-[13px] font-medium text-ink">
											Saved items
										</p>
										<p className="mt-1 text-xs text-ink-subtle">
											Your reading list on this device.
										</p>
									</div>

									<span className="text-sm font-semibold tabular-nums text-ink">
										{savedItems.length
											.toString()
											.padStart(2, "0")}
									</span>
								</div>
							</section>
						) : activeSection === "Trending" ? (
							<section className="max-w-3xl lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
								<div className="mb-3 flex items-center gap-2 text-ink-subtle">
									<TrendingUp size={14} />
									<p className="text-[10px] font-semibold uppercase tracking-wider">
										Topic index
									</p>
								</div>

								<div className="divide-y divide-line border-y border-line">
									{trendingTopics.map((topic, index) => (
										<button
											key={topic.label}
											type="button"
											onClick={() => {
												setSearch(topic.label);
												navigate("For you");
											}}
											className="group flex min-h-14 w-full items-center gap-4 py-4 text-left transition hover:bg-surface-muted/50"
										>
											<span className="w-7 shrink-0 font-mono text-[10px] text-ink-subtle">
												{String(index + 1).padStart(
													2,
													"0",
												)}
											</span>

											<span className="min-w-0 flex-1">
												<span className="block text-sm font-medium text-ink">
													{topic.label}
												</span>
												<span className="mt-1 block text-xs text-ink-subtle">
													{topic.count}
												</span>
											</span>

											<ArrowUpRight
												size={15}
												className="text-ink-subtle transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
											/>
										</button>
									))}
								</div>

								<p className="mt-4 text-[11px] leading-5 text-ink-subtle">
									Topic counts are supplied by the current
									local trending data.
								</p>
							</section>
						) : (
							<section
								aria-label="Content browser"
								className="lg:flex lg:min-h-0 lg:flex-1 lg:flex-col"
							>
								{search.trim() && !mobileDetailOpen && (
									<div className="mb-3 flex shrink-0 items-center justify-between gap-3">
										<p className="text-xs text-ink-soft">
											Search results for{" "}
											<span className="font-semibold text-ink">
												“{search.trim()}”
											</span>
										</p>

										<button
											type="button"
											onClick={() => setSearch("")}
											className="min-h-11 px-2 text-[11px] font-medium text-accent hover:underline"
										>
											Clear
										</button>
									</div>
								)}

								{activeSection === "For you" && isLoading ? (
									<div className="flex min-h-[300px] items-center justify-center border-y border-line text-xs text-ink-subtle lg:flex-1">
										<span className="mr-2 size-3 animate-spin rounded-full border-2 border-line-strong border-t-accent" />
										Loading stories…
									</div>
								) : activeSection === "For you" &&
								  isInitialError ? (
									<div className="flex min-h-[300px] flex-col items-center justify-center border-y border-dashed border-line-strong px-6 text-center lg:flex-1">
										<Compass
											size={20}
											className="text-ink-subtle"
										/>
										<h2 className="mt-4 text-sm font-semibold text-ink">
											Stories couldn’t be loaded
										</h2>
										<p className="mt-1 max-w-[270px] text-xs leading-5 text-ink-subtle">
											Check your connection or try again
											in a moment.
										</p>
										<button
											type="button"
											onClick={retry}
											className="mt-4 min-h-11 rounded-lg bg-ink px-4 py-2 text-xs font-medium text-surface transition hover:opacity-80"
										>
											Try again
										</button>
									</div>
								) : visibleContent.length === 0 ? (
									<div className="flex min-h-[300px] flex-col items-center justify-center border-y border-dashed border-line-strong px-6 text-center lg:flex-1">
										{activeSection === "Saved" ? (
											<Bookmark
												size={20}
												className="text-ink-subtle"
											/>
										) : (
											<Compass
												size={20}
												className="text-ink-subtle"
											/>
										)}

										<h2 className="mt-4 text-sm font-semibold text-ink">
											{activeSection === "Saved"
												? "Your reading list is empty"
												: "No matching stories"}
										</h2>

										<p className="mt-1 max-w-[280px] text-xs leading-5 text-ink-subtle">
											{activeSection === "Saved"
												? "Save an article or discovery and it will be waiting here."
												: "Try another search or choose a different topic."}
										</p>

										{activeSection === "Saved" && (
											<button
												type="button"
												onClick={() =>
													navigate("For you")
												}
												className="mt-4 min-h-11 px-2 text-xs font-medium text-accent hover:underline"
											>
												Explore your feed
											</button>
										)}
									</div>
								) : (
									<div className="grid min-h-[520px] grid-cols-1 overflow-hidden border-y border-line lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(300px,0.9fr)_minmax(0,1.5fr)]">
										{/* Story index */}
										<div
											className={`min-h-0 min-w-0 border-line lg:overflow-y-auto lg:overscroll-contain lg:border-r ${
												mobileDetailOpen
													? "hidden lg:block"
													: "block"
											}`}
										>
											<div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-line bg-surface px-3 sm:px-4">
												{activeSection ===
													"For you" && (
													<nav
														aria-label="Explore categories"
														className="flex min-w-0 shrink-0 text-sm items-center gap-1.5 overflow-x-auto py-2 sm:gap-2"
													>
														<span className="mr-1 shrink-0 text-[10px] font-medium uppercase tracking-wider text-ink-subtle sm:mr-2">
															Topics
														</span>

														{categories.map(
															(category) => {
																const active =
																	selectedCategory ===
																	category;

																return (
																	<button
																		key={
																			category
																		}
																		type="button"
																		onClick={() => {
																			setSelectedCategory(
																				category,
																			);
																			setSelectedId(
																				null,
																			);
																			setMobileDetailOpen(
																				false,
																			);
																			mobileReturnScrollY.current =
																				null;
																		}}
																		aria-pressed={
																			active
																		}
																		className={`min-h-8 shrink-0 rounded-md px-3 py-1 text-xs font-medium transition ${
																			active
																				? "bg-ink text-surface"
																				: "text-ink-soft hover:bg-surface-muted hover:text-ink"
																		}`}
																	>
																		{
																			category
																		}
																	</button>
																);
															},
														)}
													</nav>
												)}
											</div>

											<div className="divide-y divide-line">
												{visibleContent.map(
													(item, index) => {
														const active =
															selectedItem?.id ===
															item.id;
														const saved = isSaved(
															item.id,
														);

														return (
															<div
																key={item.id}
																className={`group relative flex items-stretch transition ${
																	active
																		? "bg-surface-muted"
																		: "hover:bg-surface-muted/60"
																}`}
															>
																<button
																	type="button"
																	onClick={() =>
																		selectItem(
																			item,
																		)
																	}
																	aria-pressed={
																		active
																	}
																	className="flex min-w-0 flex-1 gap-2.5 px-2.5 py-4 text-left sm:gap-3.5 sm:px-4"
																>
																	<span
																		className={`mt-0.5 w-4 shrink-0 font-mono text-[10px] tabular-nums sm:w-5 ${
																			active
																				? "text-accent"
																				: "text-ink-subtle"
																		}`}
																	>
																		{String(
																			index +
																				1,
																		).padStart(
																			2,
																			"0",
																		)}
																	</span>

																	{item.image && (
																		<div className="mt-0.5 h-[52px] w-[64px] shrink-0 overflow-hidden rounded-md bg-surface-muted sm:h-[64px] sm:w-[88px]">
																			{/* eslint-disable-next-line @next/next/no-img-element */}
																			<img
																				src={
																					item.image
																				}
																				alt=""
																				loading="lazy"
																				className="size-full object-cover transition duration-300 group-hover:scale-[1.04]"
																			/>
																		</div>
																	)}

																	<span className="min-w-0 flex-1">
																		<span className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
																			<span className="text-[10px] font-semibold uppercase tracking-[1px] text-accent">
																				{item.category ||
																					getTypeLabel(
																						item.type,
																					)}
																			</span>
																			<span className="size-1 rounded-full bg-line-strong" />
																			<span className="text-[10px] text-ink-subtle">
																				{item.source ||
																					"Index"}
																			</span>
																		</span>

																		<span className="block text-[13px] font-semibold leading-[1.45] tracking-[-0.15px] text-ink sm:text-sm">
																			{item.title ||
																				"Saved story"}
																		</span>

																		<span className="mt-1.5 block line-clamp-2 text-xs leading-[1.6] text-ink-soft">
																			{item.description ||
																				"Open this saved item to inspect it."}
																		</span>

																		<span className="mt-2.5 block font-mono text-[10px] text-ink-subtle">
																			{formatDate(
																				item.publishedAt,
																			)}
																		</span>
																	</span>
																</button>

																<button
																	type="button"
																	onClick={() =>
																		toggleSaved(
																			item.id,
																		)
																	}
																	aria-label={
																		saved
																			? "Remove saved item"
																			: "Save item"
																	}
																	className="mr-1 mt-2 grid size-11 shrink-0 place-items-center self-start rounded-md text-ink-subtle transition hover:bg-surface hover:text-accent sm:mr-2 sm:mt-3 sm:size-9"
																>
																	{saved ? (
																		<BookmarkCheck
																			size={
																				15
																			}
																			className="text-accent"
																		/>
																	) : (
																		<Bookmark
																			size={
																				15
																			}
																		/>
																	)}
																</button>

																{active && (
																	<span className="absolute bottom-0 left-0 top-0 w-[2px] bg-accent" />
																)}
															</div>
														);
													},
												)}
											</div>

											{activeSection === "For you" &&
												!isLoading &&
												!isInitialError && (
													<div className="px-3 py-2">
														<FeedPagination
															sentinelRef={
																sentinelRef
															}
															hasMore={hasMore}
															isFetchingMore={
																isFetchingMore
															}
															hasError={
																isLoadMoreError
															}
															onLoadMore={
																loadMore
															}
															onRetry={retry}
														/>
													</div>
												)}
										</div>

										{/* Reading pane */}
										<div
											className={`min-h-0 min-w-0 lg:overflow-y-auto lg:overscroll-contain ${
												mobileDetailOpen
													? "block"
													: "hidden lg:block"
											}`}
										>
											{selectedItem ? (
												<article className="flex min-h-[520px] flex-col lg:min-h-full">
													<div className="sticky top-0 z-10 flex h-11 shrink-0 items-center justify-between border-b border-line bg-surface px-4 sm:px-6">
														<button
															type="button"
															onClick={() =>
																setMobileDetailOpen(
																	false,
																)
															}
															className="inline-flex h-full min-h-11 items-center gap-2 px-1 text-xs font-medium text-ink-soft transition hover:text-ink lg:hidden"
														>
															<ArrowLeft
																size={14}
															/>
															Back to index
														</button>

														<span className="hidden text-[10px] font-semibold uppercase tracking-[1.2px] text-ink-subtle lg:block">
															Reading pane
														</span>

														<div className="ml-auto flex items-center gap-1">
															<button
																type="button"
																onClick={() =>
																	toggleSaved(
																		selectedItem.id,
																	)
																}
																className="inline-flex h-11 items-center gap-2 rounded-md px-2 text-xs font-medium text-ink-soft transition hover:bg-surface-muted hover:text-ink lg:h-8"
															>
																{isSaved(
																	selectedItem.id,
																) ? (
																	<BookmarkCheck
																		size={
																			15
																		}
																		className="text-accent"
																	/>
																) : (
																	<Bookmark
																		size={
																			15
																		}
																	/>
																)}
																{isSaved(
																	selectedItem.id,
																)
																	? "Saved"
																	: "Save"}
															</button>
														</div>
													</div>

													<div className="flex flex-1 flex-col px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
														<div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[1.1px]">
															<span className="text-accent">
																{selectedItem.category ||
																	getTypeLabel(
																		selectedItem.type,
																	)}
															</span>
															<span className="size-1 rounded-full bg-line-strong" />
															<span className="font-medium text-ink-subtle">
																{selectedItem.source ||
																	"Index"}
															</span>
															<span className="size-1 rounded-full bg-line-strong" />
															<span className="font-medium text-ink-subtle">
																{formatDate(
																	selectedItem.publishedAt,
																)}
															</span>
														</div>

														<h2 className="mt-5 max-w-[760px] text-[26px] font-semibold leading-[1.18] tracking-[-1px] text-ink sm:text-[32px] lg:text-[38px] lg:tracking-[-1.5px]">
															{selectedItem.title ||
																"Saved story"}
														</h2>

														<div className="my-6 h-px w-12 shrink-0 bg-accent" />

														{selectedItem.image && (
															<div className="mb-7 aspect-[16/9] w-full max-w-[820px] overflow-hidden rounded-lg bg-surface-muted">
																{/* eslint-disable-next-line @next/next/no-img-element */}
																<img
																	src={
																		selectedItem.image
																	}
																	alt=""
																	loading="lazy"
																	className="size-full object-cover"
																/>
															</div>
														)}

														<p className="max-w-[720px] whitespace-pre-line text-[14px] leading-[1.85] text-ink-soft sm:text-[15px] sm:leading-[1.9]">
															{selectedItem.description ||
																"No description is available for this item."}
														</p>

														{selectedItem.url && (
															<a
																href={
																	selectedItem.url
																}
																target="_blank"
																rel="noreferrer"
																className="mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-md border border-line px-3 py-2 text-xs font-medium text-ink-soft transition hover:border-line-strong hover:bg-surface-muted hover:text-ink"
															>
																Read original
																article
																<ExternalLink
																	size={13}
																/>
															</a>
														)}

														<div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5 lg:mt-auto lg:pt-5">
															<div className="flex items-center gap-2 text-ink-subtle">
																<Sparkles
																	size={14}
																/>
																<span className="text-xs">
																	Selected
																	from your
																	index
																</span>
															</div>

															<span className="font-mono text-[10px] text-ink-subtle">
																{getTypeLabel(
																	selectedItem.type,
																)}
															</span>
														</div>
													</div>
												</article>
											) : (
												<div className="flex min-h-[520px] items-center justify-center text-xs text-ink-subtle">
													Select a story to inspect
													it.
												</div>
											)}
										</div>
									</div>
								)}
							</section>
						)}

						<footer className="mt-10 flex shrink-0 flex-col gap-2 border-t border-line pt-4 text-[11px] text-ink-subtle sm:flex-row sm:items-center sm:justify-between lg:mt-4">
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
