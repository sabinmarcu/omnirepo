import { themeFamilyDataAttribute } from '@sabinmarcu/theme/constants';
import type { PropsWithChildren } from 'react';
import type { setupTheme } from '@sabinmarcu/website-theme';
import {
  wrapperStyle,
  wipStyle,
  wipTip,
} from './LandingCard.css';

export namespace LandingCard {
  export type Props = PropsWithChildren<{
    theme?: typeof setupTheme.families[number]
    wip?: boolean,
  }>;
}
export async function LandingCard({
  theme,
  children,
  wip,
}: LandingCard.Props) {
  const themeParam = theme ? { [`data-${themeFamilyDataAttribute}`]: theme } : {};
  return (
    <article
      {...themeParam}
      className={[wrapperStyle, wip && wipStyle].filter(Boolean).join(' ')}
      data-rand={Math.random() * 3000}
    >
      {wip ? <p className={wipTip}>Under Construction</p> : null}
      {children}
    </article>
  );
}
