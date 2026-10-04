import type { ContentItem } from "@/features/content/types/content";

export type { ContentItem } from "@/features/content/types/content";

export const mockContent: ContentItem[] = [
	{
		id: "content-01",
		type: "news",
		category: "Technology",
		source: "The Verge",
		title: "The next era of personal computing is being built around AI",
		description:
			"A shift toward more contextual, capable software is changing how people interact with their devices—and what they expect them to do.",
		image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=85",
		publishedAt: "12 min ago",
		readTime: "6 min read",
	},
	{
		id: "content-02",
		type: "recommendation",
		category: "Design",
		source: "Awwwards",
		title: "A closer look at digital spaces that feel a little more human",
		description:
			"Exploring the details, interactions, and quiet decisions that make digital products feel considered.",
		image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&q=85",
		publishedAt: "38 min ago",
		readTime: "4 min read",
	},
	{
		id: "content-03",
		type: "social",
		category: "Engineering",
		source: "Community notes",
		title: "Good abstractions make the next change easier, not just today's code shorter.",
		description:
			"A reminder from the engineering community to optimize for clarity and the next person who has to work in the system.",
		image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&q=85",
		publishedAt: "1 hr ago",
		author: "Maya Chen",
	},
	{
		id: "content-04",
		type: "news",
		category: "Science",
		source: "Quanta Magazine",
		title: "What researchers are learning from the smallest building blocks of life",
		description:
			"New tools are helping scientists ask more precise questions about complex biological systems.",
		image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=900&q=85",
		publishedAt: "2 hrs ago",
		readTime: "8 min read",
	},
];

export const trendingTopics = [
	{ label: "Artificial intelligence", count: "2.4k stories" },
	{ label: "Product engineering", count: "1.8k stories" },
	{ label: "Climate research", count: "946 stories" },
];
