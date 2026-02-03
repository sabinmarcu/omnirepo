'use server';

import { cookies } from 'next/headers';
import type { ThemeSelection } from './ThemeSelector.core';

const cookieName = 'theme-variant';

export async function getThemeVariant() {
  'use server';

  const cookiesStore = await cookies();
  const variant = cookiesStore.get(cookieName);
  return variant?.value ?? 'system';
}

export async function setThemeVariant(selection: ThemeSelection) {
  'use server';

  const cookiesStore = await cookies();
  cookiesStore.set(cookieName, selection);
}

