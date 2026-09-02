import type {
  ComponentProps,
  PropsWithChildren,
} from 'react';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { withTheme } from '@/theme/runtime';
import { cls } from '@/utils/cls';
import {
  wrapperStyle,
  wipStyle,
  wipTip,
} from './LandingCard.css';
import { rootBackgroundTrigger } from '../layout.css';

export namespace LandingCard {
  export type Props = PropsWithChildren<
    & {
      wip?: boolean,
    }
    & Partial<Pick<ComponentProps<typeof Link>, 'href'>>
  >;
}
export const LandingCard = withTheme<LandingCard.Props>(async function LandingCard({
  children,
  wip,
  href,
  ...rest
}) {
  const translate = await getTranslations('status');
  const inner = (
    <article
      {...rest}
      className={cls(
        wrapperStyle,
        { [wipStyle]: wip },
        rootBackgroundTrigger,
      )}
      data-rand={Math.random() * 3000}
    >
      {wip ? <p className={wipTip}>{translate('underConstruction')}</p> : null}
      {children}
    </article>
  );
  return (href
    ? (<Link href={href as any}>{inner}</Link>)
    : inner
  );
});
