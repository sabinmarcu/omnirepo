import { Icon } from './Icon';
import { setThemeVariant } from './ThemeSelector.core.ssr';
import {
  selectionDataAttribute,
  themeSelectorStyles,
} from './ThemeSelector.css';
import { ThemeSelectorButton } from './ThemeSelector.runtime';

export async function ThemeSelector() {
  return (
    <ThemeSelectorButton

      onClick={setThemeVariant}
      className={themeSelectorStyles}
    >
      <Icon icon="sun-solid" {...{ [selectionDataAttribute]: 'light' }} />
      <Icon icon="moon-solid" {...{ [selectionDataAttribute]: 'dark' }} />
      <Icon icon="technology" {...{ [selectionDataAttribute]: 'system' }} />
    </ThemeSelectorButton>
  );
}
