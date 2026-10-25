"use client";

import { useState } from "react";
import { ArrowRight, Check, Compass } from "lucide-react";
import {
	PREFERENCE_TOPICS,
	type PreferenceTopic,
} from "@/features/preferences/types/preferences";

interface PreferencesOnboardingProps {
	initialTopics?: PreferenceTopic[];
	onComplete: (topics: PreferenceTopic[]) => void;
}

export function PreferencesOnboarding({
	initialTopics = [],
	onComplete,
}: PreferencesOnboardingProps) {
	const [selectedTopics, setSelectedTopics] =
		useState<PreferenceTopic[]>(initialTopics);

	function toggleTopic(topic: PreferenceTopic) {
		setSelectedTopics((current) =>
			current.includes(topic)
				? current.filter((item) => item !== topic)
				: [...current, topic],
		);
	}

	return (
		<main
			className="flex min-h-dvh items-center justify-center bg-canvas px-5 py-12 text-ink"
			aria-labelledby="onboarding-title"
		>
			<section className="w-full max-w-2xl">
				<div className="mb-12 flex items-center gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl border border-line bg-surface">
						<Compass size={20} aria-hidden="true" />
					</div>
					<span className="text-lg font-semibold tracking-tight">
						Index
					</span>
					<span className="ml-auto font-mono text-xs text-ink-subtle">
						SETUP / 01
					</span>
				</div>

				<p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-ink-subtle">
					A more relevant signal
				</p>

				<h1
					id="onboarding-title"
					className="max-w-xl text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl"
				>
					What are you curious about?
				</h1>

				<p className="mt-5 max-w-lg text-sm leading-7 text-ink-soft sm:text-base">
					Choose the topics you want to follow. We’ll use them to
					shape your starting feed, and you can change them whenever
					you like.
				</p>

				<div
					className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2"
					aria-label="Choose your topics"
				>
					{PREFERENCE_TOPICS.map((topic, index) => {
						const selected = selectedTopics.includes(topic);

						return (
							<button
								key={topic}
								type="button"
								aria-pressed={selected}
								onClick={() => toggleTopic(topic)}
								className={[
									"group flex min-h-20 items-center justify-between gap-4 rounded-xl border px-5 py-4 text-left transition-colors",
									"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
									selected
										? "border-accent bg-surface"
										: "border-line bg-transparent hover:border-line-strong hover:bg-surface",
								].join(" ")}
							>
								<span className="flex items-center gap-4">
									<span className="font-mono text-xs text-ink-subtle">
										0{index + 1}
									</span>
									<span className="font-medium">{topic}</span>
								</span>

								<span
									className={[
										"flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors",
										selected
											? "border-accent bg-accent text-white"
											: "border-line text-transparent group-hover:border-line-strong",
									].join(" ")}
								>
									<Check size={14} aria-hidden="true" />
								</span>
							</button>
						);
					})}
				</div>

				<div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-xs text-ink-subtle" aria-live="polite">
						{selectedTopics.length === 0
							? "Select at least one topic to continue."
							: `${selectedTopics.length} ${
									selectedTopics.length === 1
										? "topic"
										: "topics"
								} selected`}
					</p>

					<button
						type="button"
						disabled={selectedTopics.length === 0}
						onClick={() => onComplete(selectedTopics)}
						className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-medium text-canvas transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
					>
						Build my feed
						<ArrowRight size={16} aria-hidden="true" />
					</button>
				</div>

				<p className="mt-8 text-xs leading-6 text-ink-subtle">
					Your choices stay in this browser for now. Account sync can
					be added when Index supports sign-in.
				</p>
			</section>
		</main>
	);
}
