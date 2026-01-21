/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable import/export */

import { withTheme } from '@/hocs/withTheme';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import {
  themedLinkStyle,
  type ThemedLinkStyleProps,
} from './ThemedLink.css';

export namespace ThemedLink {
  export type Props = (
    & ComponentProps<typeof Link>
    & withTheme.ThemeProps
    & ThemedLinkStyleProps
  );
}

export const ThemedLink = withTheme(function ThemedLink({
  className,
  variant,
  ...props
}: ThemedLink.Props) {
  return (
    <Link className={[
      themedLinkStyle({
        variant: variant ?? 'primary',
      }),
      className,
    ].join(' ')} {...props} />
  );
});
