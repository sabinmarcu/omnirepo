import type { Simplify } from '@sabinmarcu/types';
import {
  isRouteWIP,
} from '@/utils/routes';
import type {
  CategoryPresetType,
  CategoryType,
} from './categories';
import { categoriesMap } from './categories';

export type NavigationItemHref = { href: string };
export type NavigationItemWIP = { wip: true };
export type NavigationItemId = { id: string };
export type NavigationItemMetadata = {
  theme: keyof typeof categoriesMap,
  text: string,
};

export type NavigationItem = Simplify<(
  & NavigationItemMetadata
  & NavigationItemId
  & (
    | NavigationItemHref
    | NavigationItemWIP
  )
)>;

export type NavigationItemInput = Simplify<(
  & NavigationItemMetadata
  & Partial<NavigationItemHref>
)>;

export function normalizeNavigationList(
  list: NavigationItemInput[],
): NavigationItem[] {
  const normalizedList: NavigationItem[] = [];
  for (const { href, ...rest } of list) {
    const hrefOrWip: NavigationItemHref | NavigationItemWIP = (
      href
      && !isRouteWIP(href)
    )
      ? { href }
      : { wip: true };
    const normalizedItem = {
      ...rest,
      id: href || rest.text,
      ...hrefOrWip,
    } satisfies NavigationItem;

    normalizedList.push(normalizedItem);
  }

  return normalizedList;
}

export type CategoryPresetExtension = Simplify<
  & Omit<NavigationItemInput, keyof CategoryPresetType>
  & Omit<Partial<CategoryPresetType>, 'href'>
  & { href: string }
>;
export function extendCategory(
  category: CategoryType,
  extender: (
    preset: CategoryPresetType,
  ) => CategoryPresetExtension,
): NavigationItemInput {
  const preset = categoriesMap[category];
  const extras = extender(preset);
  return {
    ...preset,
    ...extras,
  };
}
