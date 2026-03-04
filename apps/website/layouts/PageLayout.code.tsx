import type { HTMLAttributes } from 'react';
import { withStyles } from '@/hocs/withStyles';
import type { PageLayoutCodeStylesProps } from './PageLayout.code.css';
import {
  pageLayoutCodeStyles,
} from './PageLayout.code.css';

export namespace PageLayoutCode {
  export type Props = (
    & HTMLAttributes<HTMLDivElement>
    & PageLayoutCodeStylesProps
  );
}

export const PageLayoutCode = withStyles(function PageLayoutCode({
  children,
  variant,
  ...rest
}: PageLayoutCode.Props) {
  return (
    <article
      {...rest}
    >
      <div data-container>{children}</div>
    </article>
  );
}, pageLayoutCodeStyles);
