import type {
  HTMLAttributes,
  PropsWithChildren,
} from 'react';
import { TOCAnchor } from '@/layouts/TOCAnchor';

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
  ...rest
}: Typography.Props) {
  const Element = as;
  return (
    <Element {...rest} id={id}>
      <TOCAnchor text={tocText ?? id} prefix="heading">
        {children}
      </TOCAnchor>
    </Element>
  );
}
