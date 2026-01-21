'use client';

import {
  useEffect,
  useMemo,
  type PropsWithChildren,
} from 'react';
import { tocAnchorProps } from '@/utils/toc';
import { NavigationAnchor } from './Navigation.anchor';
import { extractChildrenText } from './PageTOCLayout.utils';
import { tocAnchorSelector } from './PageTOCLayout.constants';
import { usePageUpdate } from './PageTOCLayout.core';

export namespace PageTOCLayoutAnchorClient {
  export type Props = PropsWithChildren<
    & {
      text?: string
      level?: number,
    }
    & Parameters<typeof tocAnchorProps>[1]
  >;
}

export function PageTOCLayoutAnchorClient({
  text,
  prefix,
  suffix,
  level,
  children,
}: PageTOCLayoutAnchorClient.Props) {
  const ownText = useMemo(
    () => text ?? extractChildrenText(children),
    [text, children],
  );

  const props = useMemo(
    () => tocAnchorProps(
      ownText,
      {
        prefix,
        suffix,
      },
    ),
    [text, suffix, prefix],
  );

  const update = usePageUpdate();
  useEffect(
    () => {
      if (update) {
        update({
          title: ownText,
          slug: props.id,
          level: level ?? Infinity,
        });
      }
    },
    [text, props, level],
  );

  return (
    <NavigationAnchor
      {...props}
      {...{ [tocAnchorSelector]: true }}
    />
  );
}
