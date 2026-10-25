export const PREFERENCE_TOPICS = [
	"Technology",
	"Design",
	"Engineering",
	"Science",
] as const;

export type PreferenceTopic = (typeof PREFERENCE_TOPICS)[number];

export interface UserPreferences {
	version: 1;
	topics: PreferenceTopic[];
	onboardingCompleted: boolean;
	updatedAt: string;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
	version: 1,
	topics: ["Technology", "Engineering"],
	onboardingCompleted: false,
	updatedAt: "",
};
