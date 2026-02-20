import type { HTMLAttributes } from 'react';
import { showcaseLayoutStyles } from './ShowcaseLayout.css';

export namespace ShowcaseLayout {
  export type Props = HTMLAttributes<HTMLDivElement>;
}

export function ShowcaseLayout({
  className,
  ...rest
}: ShowcaseLayout.Props) {
  return (
    <section
      {...rest}
      className={[className, showcaseLayoutStyles].join(' ')}
    />
  );
}
