import type {
  HTMLAttributes,
  PropsWithChildren,
} from 'react';
import {
  getRouteCategory,
  isRouteWIP,
} from '@/utils/routes';
import { selector } from '@sabinmarcu/website-theme';
import { rootThemeTrigger } from '@/app/layout.css';
import {
  getPathname,
  redirect404,
} from '@/utils/routes.ssr';
import { rootPageLayoutStyles } from './RootPageLayout.css';

export namespace RootPageLayout {
  export type Props = (
    & PropsWithChildren<HTMLAttributes<HTMLDivElement>>
  );
}
export async function RootPageLayout({
  children,
  className,
  ...rest
}: RootPageLayout.Props) {
  const pathname = await getPathname();
  if (isRouteWIP(pathname)) {
    return redirect404();
  }
  const section = getRouteCategory(await getPathname()) ?? 'base';
  return (
    <main
      className={[
        className,
        rootPageLayoutStyles,
        rootThemeTrigger,
      ].join(' ')}
      {...{ [selector]: section }}
      {...rest}
    >
        {children}
    </main>
  );
}
