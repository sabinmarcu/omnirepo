import type {
  HTMLAttributes,
  PropsWithChildren,
} from 'react';
import {
  selector,
  families,
} from '@sabinmarcu/website-theme';
import {
  getRouteCategory,
  isRouteWIP,
} from '@/utils/routes';
import { rootThemeTrigger } from '@/app/layout.css';
import {
  getPathname,
  redirect404,
} from '@/utils/routes.ssr';
import { rootPageLayoutStyles } from './RootPageLayout.css';

export namespace RootPageLayout {
  export type Props = (
    & PropsWithChildren<HTMLAttributes<HTMLDivElement>>
    & { theme?: typeof families[number] }
  );
}
export async function RootPageLayout({
  children,
  className,
  theme,
  ...rest
}: RootPageLayout.Props) {
  const pathname = await getPathname();
  if (isRouteWIP(pathname)) {
    return redirect404();
  }
  const section = getRouteCategory(await getPathname());
  const sectionTheme = section && families.includes(section as any)
    ? section
    : theme ?? 'base';
  return (
    <main
      className={[
        className,
        rootPageLayoutStyles,
        rootThemeTrigger,
      ].join(' ')}
      {...{ [selector]: sectionTheme }}
      {...rest}
    >
      {children}
    </main>
  );
}
