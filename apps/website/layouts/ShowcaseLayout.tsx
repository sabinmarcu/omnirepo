import type { HTMLAttributes } from 'react';
import { withStyles } from '@/hocs/withStyles';
import { showcaseLayoutStyles } from './ShowcaseLayout.css';

export namespace ShowcaseLayout {
  export type Props = HTMLAttributes<HTMLDivElement>;
}

export const ShowcaseLayout = withStyles(function ShowcaseLayout({
  children,
  ...rest
}: ShowcaseLayout.Props) {
  return (
    <section
      {...rest}
    >
      <div data-root>
        {children}
      </div>
    </section>
  );
}, showcaseLayoutStyles);