'use server';

import type { ComponentProps } from 'react';
import { PageTOCLayoutAnchor } from './PageTOCLayout.anchor';
import { PageTOCLayoutInlineAnchor } from './PageTOCLayout.anchor.inline';
import { PageTOCLayoutLink } from './PageTOCLayout.link';
import { PageTOCLayoutClient } from './PageTOCLayout.runtime';
import { TOCMobileCloseButton } from './PageTOCLayout.toc.mobile';

export namespace PageTOCLayout {
  export type Props = (
    & Omit<ComponentProps<typeof PageTOCLayoutClient>, 'tocHeader'>
    & Partial<Pick<ComponentProps<typeof PageTOCLayoutClient>, 'tocHeader'>>
  );
}

export async function PageTOCLayout(
  { tocHeader, ...props }: PageTOCLayout.Props,
) {
  return (
    <PageTOCLayoutClient
      tocHeader={tocHeader ?? (
          <h2>
            <span>Table of Contents</span>
            <TOCMobileCloseButton />
          </h2>
      )}
      {...props}
    />
  );
}

PageTOCLayout.Anchor = PageTOCLayoutAnchor;
PageTOCLayout.InlineAnchor = PageTOCLayoutInlineAnchor;
PageTOCLayout.Link = PageTOCLayoutLink;
