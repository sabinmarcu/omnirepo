import type { ComponentProps } from 'react';
import { withTheme } from '@/theme/runtime';
import { Link } from '@/i18n/navigation';
import { withStyles } from '@/hocs/withStyles';
import {
  themedLinkStyle,
} from './ThemedLink.css';
import {
  themedLinkNoIconDataAttribute,
  themedLinkNoUnderlineDataAttribute,
  themedLinkUndecoratedDataAttribute,
} from './ThemedLink.constants';

export namespace ThemedLink {
  export type Props = (
    & Omit<ComponentProps<typeof Link>, 'href'>
    & { href?: ComponentProps<typeof Link>['href'] | string }
  );
}

// Matches `scheme:` and protocol-relative (`//host`) hrefs.
const absoluteHrefPattern = /^(?:[a-z][a-z\d+\-.]*:|\/\/)/i;

function linkKind(href: ThemedLink.Props['href']) {
  if (typeof href !== 'string') {
    return 'internal' as const;
  }
  if (href.startsWith('#')) {
    return 'anchor' as const;
  }
  if (absoluteHrefPattern.test(href)) {
    return 'external' as const;
  }
  return 'internal' as const;
}

export const ThemedLink = Object.assign(withStyles(withTheme<ThemedLink.Props>(
  function ThemedLink({
    href,
    locale,
    prefetch,
    children,
    ...props
  }) {
    const kind = linkKind(href);

    if (kind !== 'internal') {
      return (
        <a
          rel={kind === 'external' ? 'noreferrer' : undefined}
          {...props}
          data-link-kind={kind}
          href={href as string}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        {...props as ComponentProps<typeof Link>}
        href={href as ComponentProps<typeof Link>['href']}
        locale={locale}
        prefetch={prefetch}
        data-link-kind={kind}
      >
        {children}
      </Link>
    );
  },
), themedLinkStyle), {
  noUnderlineDataAttribute: themedLinkNoUnderlineDataAttribute,
  noIconDataAttribute: themedLinkNoIconDataAttribute,
  undecoratedDataAttribute: themedLinkUndecoratedDataAttribute,
});
