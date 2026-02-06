import {
  ViewTransition,
  type HTMLAttributes,
  type PropsWithChildren,
} from 'react';
import type { PageLayoutStylesProps } from './PageLayout.css';
import { pageLayoutStyles } from './PageLayout.css';
import { Footer } from './Footer';

export namespace PageLayout {
  export type Props = PropsWithChildren<
    & HTMLAttributes<HTMLDivElement>
    & PageLayoutStylesProps
  >;
}
export function PageLayout({
  className,
  variant,
  children,
  ...props
}: PageLayout.Props) {
  return (
    <ViewTransition name="page-layout">
      <section
        className={[
          className,
          pageLayoutStyles({ variant }),
        ].join(' ')}
        {...props}
      >
        {children}
        <Footer />
      </section>
    </ViewTransition>
  );
}