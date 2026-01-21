import { Icon } from '@/components/Icon';
import {
  themeSelectionsMap,
} from './ThemeSelector.constants';
import {
  selectionDataAttribute,
  themeSelectorStyles,
} from './ThemeSelector.css';
import {
  getThemeVariant,
  rotateThroughThemeVariant,
} from './ThemeSelector.core';

export async function ThemeSelector() {
  const current = await getThemeVariant();
  const label = `Change theme. Currently: ${themeSelectionsMap[current]}`;
  return (
    <button
      onClick={rotateThroughThemeVariant}
      className={themeSelectorStyles}
      aria-label={label}
    >
      <Icon icon="sun-solid" {...{ [selectionDataAttribute]: 'light' }} />
      <Icon icon="moon-solid" {...{ [selectionDataAttribute]: 'dark' }} />
      <Icon icon="technology" {...{ [selectionDataAttribute]: 'system' }} />
    </button>
  );
}