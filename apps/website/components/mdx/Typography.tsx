import type {
  HTMLAttributes,
  PropsWithChildren,
} from 'react';
import { TOCAnchor } from '@/layouts/TOCAnchor';

export namespace Typography {
  export type Props = PropsWithChildren<
    & HTMLAttributes<HTMLHeadingElement>
    & { as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }
  >;
}
export function Typography({
  as,
  children,
  ...rest
}: Typography.Props) {
  const Element = as;
  return (
    <Element {...rest}>
      <TOCAnchor prefix="heading">
        {children}
      </TOCAnchor>
    </Element>
  );
}
