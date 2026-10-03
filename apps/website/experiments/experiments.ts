export const experiments = {
  scanlines: {
    title: 'CRT Scanlines',
    description: 'Draw CRT Scanlines on top of everything',
    default: true,
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
  themeDevtools: {
    title: 'Theme Devtools',
    description: 'Edit the website theme sources (in-page or via the theme devtools extension)',
    default: false,
  },
} as const;

export type Experiments = keyof typeof experiments;
