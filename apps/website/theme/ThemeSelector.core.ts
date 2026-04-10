import { cookies } from 'next/headers';
import type { ThemeSelection } from './ThemeSelector.constants';
import {
  cookieName,
  isThemeSelection,
  themeSelections,
} from './ThemeSelector.constants';

const getNextSelection = (selection: ThemeSelection) => {
  const currentIndex = themeSelections.indexOf(selection);
  const nextIndex = currentIndex >= themeSelections.length - 1
    ? 0
    : currentIndex + 1;
  return themeSelections[nextIndex];
};

export async function getThemeVariant(): Promise<ThemeSelection> {
  'use server';

  const cookiesStore = await cookies();
  const variant = cookiesStore.get(cookieName);

  const result = variant?.value && isThemeSelection(variant.value)
    ? variant.value
    : 'system';

  return result;
}

export async function setThemeVariant(selection: ThemeSelection) {
  'use server';

  const cookiesStore = await cookies();

  cookiesStore.set({
    name: cookieName,
    value: selection,
    httpOnly: true,
    path: '/',
  });

  return selection;
}

export async function rotateThroughThemeVariant() {
  'use server';

  const current = await getThemeVariant();
  const next = getNextSelection(current);

  setThemeVariant(next);
}
