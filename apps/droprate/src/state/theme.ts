import type { WritableAtom } from 'jotai';
import { atom } from 'jotai';
import { atomEffect } from 'jotai-effect';
import { atomWithStorage } from 'jotai/utils';

export const variants = [
  'light',
  'dark',
] as const;
export type Variants = typeof variants[number];
export const selections = [
  ...variants,
  'system',
] as const;
export type Selections = typeof selections[number];

export const themeSelectionAtom = atomWithStorage<Selections>('theme', 'system');

export const prefersColorSchemeAtom = atom(true) as WritableAtom<boolean, [boolean], void>;
export const prefersColorSchemeEffect = atomEffect(
  (_, set) => {
    const match = window.matchMedia('(prefers-color-scheme: dark)');
    set(prefersColorSchemeAtom, match.matches);

    const handler = (matchEvent: MediaQueryListEvent) => {
      set(prefersColorSchemeAtom, matchEvent.matches);
    };

    match.addEventListener('change', handler);
    return () => match.removeEventListener('change', handler);
  },
);

export const themeAtom = atom(
  (get) => {
    get(prefersColorSchemeEffect);
    const selection = get(themeSelectionAtom);
    let theme: Variants;
    if (selection === 'system') {
      theme = get(prefersColorSchemeAtom) ? 'dark' : 'light';
    } else {
      theme = selection;
    }
    return theme;
  },
);
