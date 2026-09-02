import type { PropsWithChildren } from 'react';
import { Icon } from '@/components/Icon';
import { Tooltip } from '@/components/Tooltip.component';
import { Experiments } from '@/experiments';
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

function NavigationSettingsRow({ children }: PropsWithChildren) {
  return <div className={navigationSettingsRowStyle}>{children}</div>;
}

export const NavigationSettings = extendComponent(
  async function NavigationSettings() {
    return (
      <>
        <button
          type="button"
          popoverTarget={navigationSettingsPopoverId}
          className={navigationSettingsTriggerStyle}
          style={{ anchorName: navigationSettingsAnchorName }}
          aria-label="Settings"
        >
          <Icon icon="cog-solid" />
        </button>
        <Tooltip
          position="left"
          style={{ positionAnchor: navigationSettingsAnchorName }}
        >
          Settings
        </Tooltip>
        <section
          id={navigationSettingsPopoverId}
          popover="auto"
          className={navigationSettingsPopoverStyle}
          aria-label="Settings"
        >
          <NavigationSettingsRow>
            <ThemeSelector />
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
