'use client';

import {
  type ComponentProps,
} from 'react';
import { usePathname } from '@/i18n/navigation';
import type { Simplify } from '@sabinmarcu/types';
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
  const cleanHref = `${href}`.replace(/\/?$/, '');
  const active = !!matchRoute(
    strictMatch
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
