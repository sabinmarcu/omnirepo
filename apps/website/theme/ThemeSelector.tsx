import { Icon } from '@/components/Icon';
import { getTranslations } from 'next-intl/server';
import { withTooltip } from '@/components/Tooltip.hoc';
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

const ThemeSelectorOption = withTooltip(
  function ThemeSelectorOption({
    tooltip: _,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { tooltip?: string }) {
    return <button {...props} type="button" />;
  },
  undefined,
  { position: 'bottom' },
);

export async function ThemeSelector() {
  const current = await getThemeVariant();
  const translate = await getTranslations('theme');
  return (
    <ThemeSelectorRuntime>
      <fieldset className={themeSelectorStyles} aria-label={translate('label')}>
        {themeSelectionOrder.map((selection) => (
          <ThemeSelectorOption
            key={selection}
            className={themeSelectorOptionStyle}
            aria-label={translate(selection)}
            aria-pressed={current === selection}
            tooltip={translate(selection)}
            {...{ [selectionDataAttribute]: selection }}
          >
            <Icon icon={themeSelectionIcons[selection]} />
          </ThemeSelectorOption>
        ))}
      </fieldset>
    </ThemeSelectorRuntime>
  );
}
