import type {
  HTMLAttributes,
  PropsWithChildren,
} from 'react';
import { TOCAnchor } from '@/layouts/TOCAnchor';
import { typographyStyles } from './Typography.css';
import { typographyUnstyledDataAttribute } from './Typography.constants';

export namespace Typography {

  export type Props = PropsWithChildren<
    & HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement>
    & { as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' }
    & { tocText?: string }
  >;
}
export function Typography({
  as,
  children,
  tocText,
  id,
  className,
  ...rest
}: Typography.Props) {
  const Element = as;
  const isHeading = as !== 'p';
  return (
    <Element
      {...rest}
      className={[typographyStyles[as], className].filter(Boolean).join(' ')}
      id={id}
    >
      {isHeading
        ? (
          <TOCAnchor text={tocText ?? id} prefix="heading">
            {children}
          </TOCAnchor>
        )
        : children}
    </Element>
  );
}
Typography.unstyledDataAttribute = typographyUnstyledDataAttribute;
