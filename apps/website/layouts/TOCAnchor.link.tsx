import type { ComponentProps } from 'react';
import { ThemedLink } from '@/components/ThemedLink';
import {
  tocLinkProps,
} from '@/utils/toc';
import { extractChildrenText } from './TOCAnchor.utils';

export namespace TOCLink {
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

export function TOCLink({
  text,
  prefix,
  suffix,
  children,
  ...rest
}: TOCLink.Props) {
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
