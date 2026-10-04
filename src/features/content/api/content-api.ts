import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ContentResponse } from "@/features/content/types/content";

type NewsQueryArgs = {
	category: string;
	page?: number;
};

export const contentApi = createApi({
	reducerPath: "contentApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "/api",
	}),
	tagTypes: ["News"],
	endpoints: (builder) => ({
		getNews: builder.query<ContentResponse, NewsQueryArgs>({
			query: ({ category, page = 1 }) => ({
				url: "/news",
				params: { category, page },
			}),

			// Keep one cache entry per category. Pages for that category
			// are merged into the same response.
			serializeQueryArgs: ({ endpointName, queryArgs }) =>
				`${endpointName}-${queryArgs.category}`,

			merge: (currentCache, incoming, { arg }) => {
				const page = arg.page ?? 1;

				// A first page replaces the category's previous feed.
				if (page === 1) {
					return incoming;
				}

				// Append only IDs that are not already in the feed.
				const seenIds = new Set(
					currentCache.items.map((item) => item.id),
				);

				for (const item of incoming.items) {
					if (!seenIds.has(item.id)) {
						seenIds.add(item.id);
						currentCache.items.push(item);
					}
				}

				currentCache.hasMore = incoming.hasMore;
				currentCache.nextCursor = incoming.nextCursor;
			},

			// A new page must trigger a request even though the cache key
			// is shared by every page in the same category.
			forceRefetch: ({ currentArg, previousArg }) =>
				currentArg?.page !== previousArg?.page ||
				currentArg?.category !== previousArg?.category,

			providesTags: (_result, _error, { category }) => [
				{ type: "News", id: category },
			],
		}),
	}),
});

export const { useGetNewsQuery } = contentApi;
