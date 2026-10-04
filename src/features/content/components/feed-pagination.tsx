"use client";

import type { RefObject } from "react";

type FeedPaginationProps = {
	sentinelRef: RefObject<HTMLDivElement | null>;
	hasMore: boolean;
	isFetchingMore: boolean;
	hasError: boolean;
	onLoadMore: () => void;
	onRetry: () => void;
};

export function FeedPagination({
	sentinelRef,
	hasMore,
	isFetchingMore,
	hasError,
	onLoadMore,
	onRetry,
}: FeedPaginationProps) {
	if (!hasMore && !isFetchingMore && !hasError) {
		return null;
	}

	return (
		<div className="flex flex-col items-center gap-3 py-5">
			{hasMore && !hasError && (
				<div
					ref={sentinelRef}
					aria-hidden="true"
					className="h-1 w-full"
				/>
			)}

			{isFetchingMore ? (
				<p role="status" className="text-[11px] text-ink-subtle">
					Loading more stories…
				</p>
			) : hasError ? (
				<div className="flex flex-col items-center gap-2 text-center">
					<p className="text-[11px] text-ink-subtle">
						More stories couldn’t be loaded.
					</p>
					<button
						type="button"
						onClick={onRetry}
						className="rounded-lg border border-line px-3 py-2 text-[11px] font-medium text-ink transition hover:border-line-strong hover:bg-surface-muted"
					>
						Try again
					</button>
				</div>
			) : hasMore ? (
				<button
					type="button"
					onClick={onLoadMore}
					className="rounded-lg border border-line px-3 py-2 text-[11px] font-medium text-ink-soft transition hover:border-line-strong hover:bg-surface-muted hover:text-ink"
				>
					Load more
				</button>
			) : null}
		</div>
	);
}
