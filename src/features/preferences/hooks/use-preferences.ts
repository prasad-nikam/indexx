"use client";

import { useCallback, useEffect, useState } from "react";
import {
	createDefaultPreferences,
	getStoredPreferences,
	savePreferences,
} from "@/features/preferences/lib/preferences-storage";
import type {
	PreferenceTopic,
	UserPreferences,
} from "@/features/preferences/types/preferences";

const PREFERENCES_EVENT = "index:preferences-changed";

export function usePreferences() {
	const [preferences, setPreferences] = useState<UserPreferences>(
		createDefaultPreferences,
	);
	const [isLoaded, setIsLoaded] = useState(false);
	const [storageAvailable, setStorageAvailable] = useState(true);

	useEffect(() => {
		const stored = getStoredPreferences();

		// This is intentional one-time hydration from browser storage.
		// eslint-disable-next-line react-hooks/set-state-in-effect
		if (stored) setPreferences(stored);

		setIsLoaded(true);
	}, []);

	useEffect(() => {
		if (!isLoaded) return;

		const handleStorageChange = () => {
			const stored = getStoredPreferences();
			if (stored) setPreferences(stored);
		};

		window.addEventListener("storage", handleStorageChange);
		window.addEventListener(PREFERENCES_EVENT, handleStorageChange);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
			window.removeEventListener(PREFERENCES_EVENT, handleStorageChange);
		};
	}, [isLoaded]);

	const persist = useCallback((next: UserPreferences) => {
		setPreferences(next);
		setStorageAvailable(savePreferences(next));
		window.dispatchEvent(new Event(PREFERENCES_EVENT));
	}, []);

	const updatePreferences = useCallback(
		(updates: Partial<Omit<UserPreferences, "version" | "updatedAt">>) => {
			setPreferences((current) => {
				const next: UserPreferences = {
					...current,
					...updates,
					version: 1,
					updatedAt: new Date().toISOString(),
				};

				savePreferences(next);
				return next;
			});
		},
		[],
	);

	const toggleTopic = useCallback(
		(topic: PreferenceTopic) => {
			const topics = preferences.topics.includes(topic)
				? preferences.topics.filter((item) => item !== topic)
				: [...preferences.topics, topic];

			updatePreferences({ topics });
		},
		[preferences.topics, updatePreferences],
	);

	const completeOnboarding = useCallback(
		(topics: PreferenceTopic[]) => {
			const uniqueTopics = [...new Set(topics)];

			if (uniqueTopics.length === 0) return false;

			persist({
				version: 1,
				topics: uniqueTopics,
				onboardingCompleted: true,
				updatedAt: new Date().toISOString(),
			});

			return true;
		},
		[persist],
	);

	return {
		preferences,
		isLoaded,
		isFirstVisit: isLoaded && !preferences.onboardingCompleted,
		storageAvailable,
		updatePreferences,
		toggleTopic,
		completeOnboarding,
	};
}
