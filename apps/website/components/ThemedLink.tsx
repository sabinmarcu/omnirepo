import { withTheme } from '@/theme/runtime';
import { Link } from '@/i18n/navigation';
import type { ComponentProps } from 'react';
import { withStyles } from '@/hocs/withStyles';
import {
  themedLinkStyle,
} from './ThemedLink.css';

export namespace ThemedLink {
  export type Props = (
    & Omit<ComponentProps<typeof Link>, 'href'>
    & { href?: ComponentProps<typeof Link>['href'] | string }
    & { raw?: boolean }
  );
}

export const ThemedLink = withStyles(withTheme<ThemedLink.Props>(
  function ThemedLink({
    raw,
    ...props
  }) {
    if (raw) {
      return (
        <a
          {...props}
          href={props.href ? `${props.href}` : undefined}
        />
      );
    }
    return (
      <Link {...props as ComponentProps<typeof Link>} />
    );
  },
), themedLinkStyle);
