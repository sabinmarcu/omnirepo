import {
  ViewTransition,
  type HTMLAttributes,
  type PropsWithChildren,
} from 'react';
import { pageLayoutStyles } from './PageLayout.css';

export namespace PageLayout {
  export type Props = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;
}
export function PageLayout({ className, ...props }: PageLayout.Props) {
  return (
    <ViewTransition name="page-layout">
      <section
        className={[
          className,
          pageLayoutStyles,
        ].join(' ')}
        {...props}
      />
    </ViewTransition>
  );
}
