import { cookies } from 'next/headers';
import type { ThemeSelection } from './ThemeSelector.constants';
import {
  cookieName,
  isThemeSelection,
} from './ThemeSelector.constants';

export async function getThemeVariant(): Promise<ThemeSelection> {
  const cookiesStore = await cookies();
  const variant = cookiesStore.get(cookieName);

  const result = variant?.value && isThemeSelection(variant.value)
    ? variant.value
    : 'system';

  return result;
}
