import type { PropsWithChildren } from 'react';
import { tocAnchorProps } from '@/utils/toc';
import { NavigationAnchor } from './Navigation.anchor';
import { extractChildrenText } from './TOCAnchor.utils';
import { tocAnchorSelector } from './TOCAnchor.constants';

export namespace TOCAnchor {
  export type Props = PropsWithChildren<
    & { text?: string }
    & Parameters<typeof tocAnchorProps>[1]
  >;
}

/** Emits a zero-size scroll target beside its children; the TOC tree comes from source metadata. */
export function TOCAnchor({
  text,
  prefix,
  suffix,
  children,
}: TOCAnchor.Props) {
  const props = tocAnchorProps(
    text ?? extractChildrenText(children),
    {
      prefix,
      suffix,
    },
  );
  return (
    <>
      <NavigationAnchor
        {...props}
        {...{ [tocAnchorSelector]: true }}
      />
      {children}
    </>
  );
}
