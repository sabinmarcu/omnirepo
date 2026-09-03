'use client';

import {
  type ComponentProps,
} from 'react';
import type { Simplify } from '@sabinmarcu/types';
import { usePathname } from '@/i18n/navigation';
import { ThemedLink } from '@/components/ThemedLink';
import { matchRoute } from '@/utils/routes';
import type { NavigationLinkStylesProps } from './Navigation.link.css';
import { navigationLinkStyles } from './Navigation.link.css';

type HrefParam = Pick<ComponentProps<typeof ThemedLink>, 'href'>;
export namespace NavigationLink {
  export type Props = Simplify<(
    & Omit<ComponentProps<typeof ThemedLink>, 'href'>
    & Partial<HrefParam>
    & Omit<Exclude<NavigationLinkStylesProps, undefined>, 'active'>
    & { strictMatch?: boolean }
  )>;
}

export function NavigationLink({
  href,
  className,
  wip,
  strictMatch = false,
  ...props
}: NavigationLink.Props) {
  const pathname = usePathname();
  const hrefPath = String(href);
  const cleanHref = hrefPath === '/'
    ? hrefPath
    : hrefPath.replace(/\/?$/, '');
  const active = !!matchRoute(
    strictMatch || cleanHref === '/'
      ? cleanHref
      : `${cleanHref}/[[...rest]]`,
    pathname,
  );
  const hrefParam = (href ? { href } : {}) as unknown as
    HrefParam;
  return (
    <ThemedLink
      className={[
        className,
        navigationLinkStyles({
          active,
          wip,
        }),
      ].join(' ')}
      {...props}
      {...hrefParam}
    />
  );
}
