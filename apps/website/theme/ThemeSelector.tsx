import { Icon } from '@/components/Icon';
import {
  themeSelectionIcons,
  themeSelectionOrder,
  themeSelectionsMap,
} from './ThemeSelector.constants';
import { getThemeVariant } from './ThemeSelector.core';
import { ThemeSelectorRuntime } from './ThemeSelector.runtime';
import {
  selectionDataAttribute,
  themeSelectorOptionStyle,
  themeSelectorStyles,
} from './ThemeSelector.css';

export async function ThemeSelector() {
  const current = await getThemeVariant();
  return (
    <ThemeSelectorRuntime>
      <fieldset className={themeSelectorStyles} aria-label="Theme">
        {themeSelectionOrder.map((selection) => (
          <button
            type="button"
            key={selection}
            className={themeSelectorOptionStyle}
            aria-label={themeSelectionsMap[selection]}
            aria-pressed={current === selection}
            {...{ [selectionDataAttribute]: selection }}
          >
            <Icon icon={themeSelectionIcons[selection]} />
          </button>
        ))}
      </fieldset>
    </ThemeSelectorRuntime>
  );
}
