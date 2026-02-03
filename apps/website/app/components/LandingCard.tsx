/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable import/export */
import type {
  ComponentProps,
  PropsWithChildren,
} from 'react';
import Link from 'next/link';
import { withTheme } from '@/theme/runtime';
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
export const LandingCard = withTheme(async function LandingCard({
  children,
  wip,
  href,
  ...rest
}: LandingCard.Props) {
  const inner = (
    <article
      {...rest}
      className={[
        wrapperStyle,
        wip && wipStyle,
        rootBackgroundTrigger,
      ].filter(Boolean).join(' ')}
      data-rand={Math.random() * 3000}
    >
      {wip ? <p className={wipTip}>Under Construction</p> : null}
      {children}
    </article>
  );
  return (href
    ? (<Link href={href as any}>{inner}</Link>)
    : inner
  );
});
