import type { HTMLAttributes } from 'react';
import { withStyles } from '@/hocs/withStyles';
import type { PageLayoutInsetStylesProps } from './PageLayout.inset.css';
import {
  pageLayoutInsetStyles,
} from './PageLayout.inset.css';

export namespace PageLayoutInset {
  export type Props = (
    & HTMLAttributes<HTMLDivElement>
    & PageLayoutInsetStylesProps
  );
}

export const PageLayoutInset = withStyles(function PageLayoutInset({
  children,
  variant,
  ...rest
}: PageLayoutInset.Props) {
  return (
    <article {...rest}>
      <div data-container>{children}</div>
    </article>
  );
}, pageLayoutInsetStyles);
