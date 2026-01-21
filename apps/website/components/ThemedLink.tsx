import { withTheme } from '@/theme/runtime';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { withStyles } from '@/hocs/withStyles';
import {
  themedLinkStyle,
} from './ThemedLink.css';

export namespace ThemedLink {
  export type Props = (
    & ComponentProps<typeof Link>
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
      <Link {...props} />
    );
  },
), themedLinkStyle);
