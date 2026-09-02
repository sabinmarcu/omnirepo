export const experiments = {
  scanlines: {
    title: 'CRT Scanlines',
    description: 'Draw CRT Scanlines on top of everything',
    default: false,
  },
  animatedNavigation: {
    title: 'Animated Navigation',
    description: 'Scroll-based animated navigation',
    default: false,
  },
  languageSuggestionBanner: {
    title: 'Language Suggestion Banner',
    description: 'Suggest an available browser-language version',
    default: false,
  },
} as const;

export type Experiments = keyof typeof experiments;
