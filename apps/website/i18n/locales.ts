export const locales = ['en', 'ro'] as const;

export type Locale = (typeof locales)[number];

export const isLocale = (value: unknown): value is Locale => (
  locales.includes(value as Locale)
);
