import type { ContentItem } from "@/features/content/types/content";

export interface NewsApiArticle {
	source?: {
		id?: string | null;
		name?: string | null;
	} | null;
	author?: string | null;
	title?: string | null;
	description?: string | null;
	url?: string | null;
	urlToImage?: string | null;
	publishedAt?: string | null;
	content?: string | null;
}

export function normalizeNewsArticle(
	article: NewsApiArticle,
	category: string,
): ContentItem | null {
	const title = article.title?.trim();
	const url = article.url?.trim();

	if (!title || !url || title === "[Removed]") {
		return null;
	}

	return {
		id: `news:${url}`,
		type: "news",
		category,
		source: article.source?.name?.trim() || "News",
		title,
		description:
			article.description?.trim() ||
			article.content?.trim() ||
			"Open the article to read the full story.",
		image: article.urlToImage?.trim() || undefined,
		url,
		publishedAt: article.publishedAt || new Date().toISOString(),
		author: article.author?.trim() || undefined,
		readTime: undefined,
	};
}
