export type ContentType = "news" | "recommendation" | "social";

export interface ContentItem {
	id: string;
	type: ContentType;
	category: string;
	source: string;
	title: string;
	description: string;
	image?: string;
	url?: string;
	publishedAt: string;
	readTime?: string;
	author?: string;
	rating?: number;
}

export interface ContentResponse {
	items: ContentItem[];
	nextCursor?: string;
	hasMore: boolean;
}
