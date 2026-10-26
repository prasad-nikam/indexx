"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGetNewsQuery } from "@/features/content/api/content-api";
import type { ContentItem } from "@/features/content/types/content";
import type { PreferenceTopic } from "@/features/preferences/types/preferences";

const TOPICS: PreferenceTopic[] = [
	"Technology",
	"Design",
	"Engineering",
	"Science",
];

export function useNewsFeed(
	topics: readonly PreferenceTopic[],
	enabled = true,
) {
	const [pages, setPages] = useState<Record<string, number>>({});
	const sentinelRef = useRef<HTMLDivElement>(null);
	const loadInFlightRef = useRef(false);

	const followed = useMemo(
		() => topics.filter((topic) => TOPICS.includes(topic)),
		[topics],
	);

	// Keep query hooks unconditional; skip topics the user doesn't follow.
	const technology = useGetNewsQuery(
		{ category: "Technology", page: pages.Technology ?? 1 },
		{ skip: !enabled || !followed.includes("Technology") },
	);
	const design = useGetNewsQuery(
		{ category: "Design", page: pages.Design ?? 1 },
		{ skip: !enabled || !followed.includes("Design") },
	);
	const engineering = useGetNewsQuery(
		{ category: "Engineering", page: pages.Engineering ?? 1 },
		{ skip: !enabled || !followed.includes("Engineering") },
	);
	const science = useGetNewsQuery(
		{ category: "Science", page: pages.Science ?? 1 },
		{ skip: !enabled || !followed.includes("Science") },
	);

	const queries = useMemo(
		() => ({
			Technology: technology,
			Design: design,
			Engineering: engineering,
			Science: science,
		}),
		[technology, design, engineering, science],
	);

	const activeQueries = followed.map((topic) => ({
		topic,
		...queries[topic],
	}));

	const isFetching = activeQueries.some((query) => query.isFetching);
	const hasMore = activeQueries.some((query) => query.data?.hasMore);
	const isFetchingMore = activeQueries.some(
		(query) => query.isFetching && (pages[query.topic] ?? 1) > 1,
	);

	const items = useMemo(() => {
		const byId = new Map<string, ContentItem>();

		for (const topic of followed) {
			for (const item of queries[topic].data?.items ?? []) {
				if (!byId.has(item.id)) {
					byId.set(item.id, item);
				}
			}
		}

		return [...byId.values()].sort((a, b) => {
			const dateA = Date.parse(a.publishedAt) || 0;
			const dateB = Date.parse(b.publishedAt) || 0;
			return dateB - dateA;
		});
	}, [followed, queries]);

	const isLoading =
		enabled &&
		followed.length > 0 &&
		items.length === 0 &&
		activeQueries.some((query) => query.isLoading);

	const isInitialError =
		enabled &&
		followed.length > 0 &&
		items.length === 0 &&
		!activeQueries.some((query) => query.isFetching || query.isLoading) &&
		activeQueries.some((query) => query.isError);

	const isLoadMoreError = activeQueries.some(
		(query) => query.isError && Boolean(query.data?.items.length),
	);

	useEffect(() => {
		if (!isFetching) {
			loadInFlightRef.current = false;
		}
	}, [isFetching]);

	const loadMore = useCallback(() => {
		if (
			!enabled ||
			isFetching ||
			isLoadMoreError ||
			loadInFlightRef.current
		) {
			return;
		}

		const candidates = followed
			.filter((topic) => {
				const query = queries[topic];
				return (
					query.data?.hasMore && !query.isFetching && !query.isError
				);
			})
			.sort((a, b) => (pages[a] ?? 1) - (pages[b] ?? 1));

		const nextTopic = candidates[0];
		if (!nextTopic) return;

		loadInFlightRef.current = true;
		setPages((current) => ({
			...current,
			[nextTopic]: (current[nextTopic] ?? 1) + 1,
		}));
	}, [enabled, followed, queries, pages, isFetching, isLoadMoreError]);

	useEffect(() => {
		const sentinel = sentinelRef.current;

		if (
			!sentinel ||
			!enabled ||
			!hasMore ||
			isFetching ||
			isLoadMoreError ||
			typeof IntersectionObserver === "undefined"
		) {
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) loadMore();
			},
			{ root: null, rootMargin: "300px 0px", threshold: 0 },
		);

		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [enabled, hasMore, isFetching, isLoadMoreError, loadMore]);

	const retry = useCallback(() => {
		const failed = followed.filter((topic) => queries[topic].isError);
		if (failed.length === 0) {
			void Promise.all(followed.map((topic) => queries[topic].refetch()));
			return;
		}

		void Promise.all(failed.map((topic) => queries[topic].refetch()));
	}, [followed, queries]);

	return {
		items,
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
