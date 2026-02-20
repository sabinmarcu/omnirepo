import {
  ViewTransition,
  type HTMLAttributes,
  type PropsWithChildren,
} from 'react';
import type { PageLayoutStylesProps } from './PageLayout.css';
import { pageLayoutStyles } from './PageLayout.css';
import { Footer } from './Footer';
import { PageLayoutCode } from './PageLayout.code';
import './PageLayout.mobile.css.ts';

export namespace PageLayout {
  export type Props = PropsWithChildren<
    & HTMLAttributes<HTMLDivElement>
    & PageLayoutStylesProps
    & {
      disableTransition?: boolean
      disableFooter?: boolean
    }
  >;
}
export function PageLayout({
  className,
  variant,
  children,
  disableTransition,
  disableFooter,
  ...props
}: PageLayout.Props) {
  const renderTransition = !disableTransition;
  const renderFooter = !disableFooter;
  const footerContent = renderFooter
    ? (<Footer />)
    : null;
  const innerContent = (
    <section
      className={[
        className,
        pageLayoutStyles({ variant }),
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
      {footerContent}
    </section>
  );
  return renderTransition
    ? (
      <ViewTransition name="page-layout">
        {innerContent}
      </ViewTransition>
    )
    : innerContent;
}

PageLayout.Code = PageLayoutCode;
