import type { HTMLAttributes } from 'react';
import type { PageLayoutCodeStylesProps } from './PageLayout.code.css';
import {
  pageLayoutCodeStyles,
  pageLayoutCodeStylesRaw,
} from './PageLayout.code.css';

export namespace PageLayoutCode {
  export type Props = (
    & HTMLAttributes<HTMLDivElement>
    & PageLayoutCodeStylesProps
  );
}

export function PageLayoutCode({
  className,
  children,
  variant,
  ...rest
}: PageLayoutCode.Props) {
  return (
    <article
      {...rest}
      className={[className, pageLayoutCodeStyles({ variant })].join(' ')}
    >
      <div data-container>{children}</div>
    </article>
  );
}

PageLayoutCode.variants = Object.keys(
  pageLayoutCodeStylesRaw.variants.variant,
) as unknown as (keyof typeof pageLayoutCodeStylesRaw.variants.variant)[];