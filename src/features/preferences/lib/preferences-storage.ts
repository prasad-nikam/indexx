import {
	DEFAULT_PREFERENCES,
	PREFERENCE_TOPICS,
	type PreferenceTopic,
	type UserPreferences,
} from "@/features/preferences/types/preferences";

const STORAGE_KEY = "index-preferences";

function isPreferenceTopic(value: unknown): value is PreferenceTopic {
	return (
		typeof value === "string" &&
		(PREFERENCE_TOPICS as readonly string[]).includes(value)
	);
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

export function getStoredPreferences(): UserPreferences | null {
	if (typeof window === "undefined") return null;

	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;

		const parsed: unknown = JSON.parse(raw);

		if (!isRecord(parsed) || parsed.version !== 1) {
			return null;
		}

		if (
			!Array.isArray(parsed.topics) ||
			typeof parsed.onboardingCompleted !== "boolean"
		) {
			return null;
		}

		const topics = [...new Set(parsed.topics.filter(isPreferenceTopic))];

		return {
			version: 1,
			topics,
			onboardingCompleted: parsed.onboardingCompleted,
			updatedAt:
				typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
		};
	} catch {
		// Storage may be unavailable or contain malformed data.
		return null;
	}
}

export function savePreferences(preferences: UserPreferences): boolean {
	if (typeof window === "undefined") return false;

	try {
		const safePreferences: UserPreferences = {
			version: 1,
			topics: [...new Set(preferences.topics)].filter(isPreferenceTopic),
			onboardingCompleted: preferences.onboardingCompleted,
			updatedAt: new Date().toISOString(),
		};

		window.localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify(safePreferences),
		);

		return true;
	} catch {
		// Includes storage restrictions and quota errors.
		return false;
	}
}

export function createDefaultPreferences(): UserPreferences {
	return {
		...DEFAULT_PREFERENCES,
		topics: [...DEFAULT_PREFERENCES.topics],
	};
}
