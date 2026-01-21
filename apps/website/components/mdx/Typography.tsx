import { PageTOCLayout } from '@/layouts/PageTOCLayout';
import type {
  HTMLAttributes,
  PropsWithChildren,
} from 'react';

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
  const elementMatch = as.match('^h([0-9])$');
  const level = (elementMatch ? Number.parseInt(elementMatch[1], 10) : undefined) ?? 0;
  return (
    <Element {...rest}>
      <PageTOCLayout.Anchor prefix="heading" level={level}>
        {children}
      </PageTOCLayout.Anchor>
    </Element>
  );
}
