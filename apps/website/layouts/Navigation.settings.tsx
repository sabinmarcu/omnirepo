import type { PropsWithChildren } from 'react';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { Icon } from '@/components/Icon';
import { Tooltip } from '@/components/Tooltip.component';
import { Experiments } from '@/experiments';
import { LocaleSwitcher } from '@/i18n/LocaleSwitcher';
import { ThemeSelector } from '@/theme';
import { extendComponent } from '@/utils/components';
import {
  navigationSettingsCommandStyle,
  navigationSettingsPopoverStyle,
  navigationSettingsRowStyle,
  navigationSettingsTriggerStyle,
} from './Navigation.settings.css';
import {
  navigationSettingsAnchorName,
  navigationSettingsPopoverId,
} from './Navigation.settings.constants';

const navigationSettingsTooltipId = 'navigation-settings-tooltip';

function NavigationSettingsRow({ children }: PropsWithChildren) {
  return <div className={navigationSettingsRowStyle}>{children}</div>;
}

export namespace NavigationSettings {
  export type Props = {
    localeParams?: Partial<Record<Locale, Record<string, string>>>,
  };
}

export const NavigationSettings = extendComponent(
  async function NavigationSettings({ localeParams }: NavigationSettings.Props) {
    const translate = await getTranslations('settings');
    return (
      <>
        <button
          type="button"
          popoverTarget={navigationSettingsPopoverId}
          className={navigationSettingsTriggerStyle}
          style={{ anchorName: navigationSettingsAnchorName }}
          aria-label={translate('label')}
          {...{ interestfor: navigationSettingsTooltipId }}
        >
          <Icon icon="cog-solid" />
        </button>
        <Tooltip
          id={navigationSettingsTooltipId}
          position="bottom"
          style={{ positionAnchor: navigationSettingsAnchorName }}
        >
          {translate('label')}
        </Tooltip>
        <section
          id={navigationSettingsPopoverId}
          popover="auto"
          className={navigationSettingsPopoverStyle}
          aria-label={translate('label')}
        >
          <NavigationSettingsRow>
            <ThemeSelector />
          </NavigationSettingsRow>
          <NavigationSettingsRow>
            <LocaleSwitcher localeParams={localeParams} />
          </NavigationSettingsRow>
          <NavigationSettingsRow>
            <Experiments.Trigger className={navigationSettingsCommandStyle} />
          </NavigationSettingsRow>
        </section>
      </>
    );
  },
  { Row: NavigationSettingsRow },
);
