"use client";

import { Bookmark, Clock3, ExternalLink, MessageCircle } from "lucide-react";
import type { ContentItem } from "@/lib/mock-content";

interface ContentCardProps {
	item: ContentItem;
	saved: boolean;
	onToggleSaved: (id: string) => void;
	featured?: boolean;
}

const typeLabels = {
	news: "ARTICLE",
	culture: "DISCOVERY",
	social: "COMMUNITY",
};

export function ContentCard({
	item,
	saved,
	onToggleSaved,
	featured = false,
}: ContentCardProps) {
	return (
		<article
			className={`group overflow-hidden rounded-xl border border-line bg-surface transition duration-200 hover:border-line-strong hover:shadow-[var(--shadow-soft)] ${
				featured ? "md:grid md:grid-cols-[1.05fr_0.95fr]" : ""
			}`}
		>
			<div
				className={`relative overflow-hidden bg-surface-muted ${
					featured
						? "aspect-[1.6] md:aspect-auto md:min-h-[270px]"
						: "aspect-[1.85]"
				}`}
			>
				<img
					src={item.image}
					alt=""
					loading="lazy"
					className="size-full object-cover transition duration-500 ease-out group-hover:scale-[1.025]"
				/>
				<span className="absolute left-3 top-3 rounded-md border border-white/20 bg-black/55 px-2 py-1 text-[9px] font-semibold tracking-[1px] text-white backdrop-blur-md">
					{typeLabels[item.type]}
				</span>
			</div>

			<div
				className={`flex min-w-0 flex-col ${featured ? "p-5 sm:p-6" : "p-4"}`}
			>
				<div className="flex items-center gap-2 text-[10px] text-ink-subtle">
					<span className="font-semibold text-accent">
						{item.category}
					</span>
					<span className="size-0.5 rounded-full bg-ink-subtle" />
					<span>{item.source}</span>
					<span className="ml-auto whitespace-nowrap">
						{item.publishedAt}
					</span>
				</div>

				<h2
					className={`mt-3 font-semibold leading-[1.35] tracking-[-0.45px] text-ink transition-colors group-hover:text-accent ${
						featured ? "text-[20px] sm:text-[23px]" : "text-[15px]"
					}`}
				>
					{item.title}
				</h2>

				<p
					className={`mt-2 text-[12px] leading-[1.7] text-ink-soft ${
						featured ? "line-clamp-4" : "line-clamp-3"
					}`}
				>
					{item.description}
				</p>

				<div className="mt-auto flex items-center justify-between gap-3 pt-5">
					<div className="flex items-center gap-2 text-[10px] text-ink-subtle">
						{item.type === "social" ? (
							<>
								<MessageCircle size={13} />
								<span>{item.author ?? "Community"}</span>
							</>
						) : (
							<>
								<Clock3 size={13} />
								<span>{item.readTime ?? "Explore"}</span>
							</>
						)}
					</div>

					<div className="flex items-center gap-1">
						<button
							onClick={() => onToggleSaved(item.id)}
							aria-label={
								saved ? "Remove from saved" : "Save item"
							}
							aria-pressed={saved}
							title={
								saved ? "Remove from saved" : "Save for later"
							}
							className={`grid size-8 place-items-center rounded-lg transition ${
								saved
									? "bg-accent-soft text-accent"
									: "text-ink-subtle hover:bg-surface-muted hover:text-ink"
							}`}
						>
							<Bookmark
								size={15}
								fill={saved ? "currentColor" : "none"}
							/>
						</button>
						<button
							aria-label={`Open ${item.title}`}
							title="Open content"
							className="flex h-8 items-center gap-1.5 rounded-lg bg-ink px-2.5 text-[10px] font-medium text-white transition hover:opacity-85"
						>
							Explore <ExternalLink size={12} />
						</button>
					</div>
				</div>
			</div>
		</article>
	);
}
