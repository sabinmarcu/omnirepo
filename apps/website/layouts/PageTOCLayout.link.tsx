import { ThemedLink } from '@/components/ThemedLink';
import {
  tocLinkProps,
} from '@/utils/toc';
import type { ComponentProps } from 'react';
import { extractChildrenText } from './PageTOCLayout.utils';

export namespace PageTOCLayoutAnchor {
  export type Props = (
    & {
      text?: string
    }
    & Parameters<typeof tocLinkProps>[1]
    & Omit<
      ComponentProps<typeof ThemedLink>,
      keyof ReturnType<typeof tocLinkProps>
    >
  );
}

export function PageTOCLayoutLink({
  text,
  prefix,
  suffix,
  children,
  ...rest
}: PageTOCLayoutAnchor.Props) {
  const props = tocLinkProps(
    text ?? extractChildrenText(children),
    {
      prefix,
      suffix,
    },
  ) as any;
  return (
    <ThemedLink
      {...rest}
      {...props}
    >
      {children}
    </ThemedLink>
  );
}
