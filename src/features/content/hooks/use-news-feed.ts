"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGetNewsQuery } from "@/features/content/api/content-api";

export function useNewsFeed(category: string, enabled = true) {
	const [pagesByCategory, setPagesByCategory] = useState<
		Record<string, number>
	>({});

	const page = pagesByCategory[category] ?? 1;
	const sentinelRef = useRef<HTMLDivElement>(null);
	const loadInFlightRef = useRef(false);

	const { data, isLoading, isFetching, isError, refetch } = useGetNewsQuery(
		{ category, page },
		{ skip: !enabled },
	);

	const hasMore = data?.hasMore ?? false;
	const isFetchingMore = isFetching && page > 1;
	const isInitialError = isError && !data;
	const isLoadMoreError = isError && Boolean(data);

	// Release the guard when the request finishes. This prevents multiple
	// observer callbacks from advancing the page during one request.
	useEffect(() => {
		if (!isFetching) {
			loadInFlightRef.current = false;
		}
	}, [isFetching]);

	const loadMore = useCallback(() => {
		if (
			!enabled ||
			!hasMore ||
			isFetching ||
			isError ||
			loadInFlightRef.current
		) {
			return;
		}

		loadInFlightRef.current = true;

		setPagesByCategory((current) => ({
			...current,
			[category]: (current[category] ?? 1) + 1,
		}));
	}, [category, enabled, hasMore, isError, isFetching]);

	useEffect(() => {
		const sentinel = sentinelRef.current;

		if (
			!sentinel ||
			!enabled ||
			!hasMore ||
			isFetching ||
			isError ||
			typeof IntersectionObserver === "undefined"
		) {
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					loadMore();
				}
			},
			{
				root: null,
				rootMargin: "300px 0px",
				threshold: 0,
			},
		);

		observer.observe(sentinel);

		return () => observer.disconnect();
	}, [enabled, hasMore, isError, isFetching, loadMore]);

	const retry = useCallback(() => {
		loadInFlightRef.current = true;
		void refetch().finally(() => {
			loadInFlightRef.current = false;
		});
	}, [refetch]);

	return {
		items: data?.items ?? [],
		isLoading,
		isFetching,
		isFetchingMore,
		isInitialError,
		isLoadMoreError,
		hasMore,
		loadMore,
		retry,
		sentinelRef,
	};
}
