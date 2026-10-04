import { NextRequest, NextResponse } from "next/server";
import {
	normalizeNewsArticle,
	type NewsApiArticle,
} from "@/features/content/api/news-adapter";
import type { ContentResponse } from "@/features/content/types/content";

const NEWS_API_URL = "https://newsapi.org/v2/everything";
const PAGE_SIZE = 20;
const MAX_PAGE = 100;

const categoryQueries: Record<string, string> = {
	Technology: "technology OR artificial intelligence OR software",
	Design: "design OR user experience OR product design",
	Engineering: "software engineering OR programming OR developers",
	Science: "science OR scientific research OR space",
};

interface NewsApiResponse {
	status?: string;
	code?: string;
	message?: string;
	totalResults?: number;
	articles?: NewsApiArticle[];
}

function errorResponse(message: string, status: number) {
	return NextResponse.json({ error: message }, { status });
}

export async function GET(request: NextRequest) {
	const apiKey = process.env.NEWS_API_KEY;

	if (!apiKey) {
		return errorResponse(
			"News service is not configured. Add NEWS_API_KEY to the server environment.",
			503,
		);
	}

	const searchParams = request.nextUrl.searchParams;
	const requestedCategory = searchParams.get("category") ?? "Technology";
	const category = Object.keys(categoryQueries).find(
		(value) => value.toLowerCase() === requestedCategory.toLowerCase(),
	);

	if (!category) {
		return errorResponse("Unsupported news category.", 400);
	}

	const requestedPage = Number(searchParams.get("page") ?? "1");
	const page = Number.isInteger(requestedPage)
		? Math.min(Math.max(requestedPage, 1), MAX_PAGE)
		: 1;

	const params = new URLSearchParams({
		q: categoryQueries[category],
		language: "en",
		sortBy: "publishedAt",
		pageSize: String(PAGE_SIZE),
		page: String(page),
		apiKey,
	});

	try {
		const response = await fetch(`${NEWS_API_URL}?${params.toString()}`, {
			method: "GET",
			cache: "no-store",
			headers: {
				Accept: "application/json",
			},
		});

		if (!response.ok) {
			return errorResponse(
				"The news provider could not complete the request. Please try again later.",
				502,
			);
		}

		const payload = (await response.json()) as NewsApiResponse;

		if (payload.status !== "ok" || !Array.isArray(payload.articles)) {
			return errorResponse(
				"The news provider returned an unexpected response.",
				502,
			);
		}

		const items = payload.articles
			.map((article) => normalizeNewsArticle(article, category))
			.filter((item) => item !== null);

		const totalResults = payload.totalResults ?? 0;

		const result: ContentResponse = {
			items,
			hasMore: page * PAGE_SIZE < totalResults,
			nextCursor:
				page * PAGE_SIZE < totalResults ? String(page + 1) : undefined,
		};

		return NextResponse.json(result, {
			headers: {
				"Cache-Control": "no-store",
			},
		});
	} catch {
		return errorResponse(
			"Unable to reach the news provider. Check your connection and try again.",
			502,
		);
	}
}
