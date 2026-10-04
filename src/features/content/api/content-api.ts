import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ContentResponse } from "@/features/content/types/content";

export const contentApi = createApi({
	reducerPath: "contentApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "/api",
	}),
	tagTypes: ["News"],
	endpoints: (builder) => ({
		getNews: builder.query<
			ContentResponse,
			{ category: string; page?: number }
		>({
			query: ({ category, page = 1 }) => ({
				url: "/news",
				params: { category, page },
			}),
			providesTags: ["News"],
		}),
	}),
});

export const { useGetNewsQuery } = contentApi;
