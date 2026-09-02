import type {
  HTMLAttributes,
  PropsWithChildren,
} from 'react';
import type { families } from '@sabinmarcu/website-theme';
import {
  selector,
} from '@sabinmarcu/website-theme';
import { rootThemeTrigger } from '@/app/layout.css';
import { rootPageLayoutStyles } from './RootPageLayout.css';

export namespace RootPageLayout {
  export type Props = (
    & PropsWithChildren<HTMLAttributes<HTMLDivElement>>
    & { theme?: typeof families[number] }
  );
}
export function RootPageLayout({
  children,
  className,
  theme,
  ...rest
}: RootPageLayout.Props) {
  return (
    <main
      className={[
        className,
        rootPageLayoutStyles,
        rootThemeTrigger,
      ].join(' ')}
      {...{ [selector]: theme ?? 'base' }}
      {...rest}
    >
      {children}
    </main>
  );
}
