import type {
  HTMLAttributes,
  PropsWithChildren,
} from 'react';
import { TOCAnchor } from '@/layouts/TOCAnchor';
import { typographyStyles } from './Typography.css';
import { typographyUnstyledDataAttribute } from './Typography.constants';

export namespace Typography {

  export type Props = PropsWithChildren<
    & HTMLAttributes<HTMLHeadingElement>
    & { as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }
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
  return (
    <Element
      {...rest}
      className={[typographyStyles[as], className].filter(Boolean).join(' ')}
      id={id}
    >
      <TOCAnchor text={tocText ?? id} prefix="heading">
        {children}
      </TOCAnchor>
    </Element>
  );
}
Typography.unstyledDataAttribute = typographyUnstyledDataAttribute;
