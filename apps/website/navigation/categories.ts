import type { families } from '@sabinmarcu/website-theme';

export const categories = [
  'personal',
  'projects',
  'articles',
  'ramblings',
  'snippets',
] as const satisfies typeof families[number][];

export const categoriesMap = Object.fromEntries(
  categories.map((category) => [
    category,
    {
      theme: category,
      href: `/${category}`,
    },
  ]),
) as unknown as {
  [Key in typeof families[number]]: {
    theme: Key,
    href: `/${Key}`
  }
};

export type CategoryType = typeof categories[number];
export type CategoryPresetType = typeof categoriesMap[CategoryType];

