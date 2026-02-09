'use server';

import type { ComponentProps } from 'react';
import { PageTOCLayoutAnchor } from './PageTOCLayout.anchor';
import { PageTOCLayoutInlineAnchor } from './PageTOCLayout.anchor.inline';
import { PageTOCLayoutLink } from './PageTOCLayout.link';
import { PageTOCLayoutClient } from './PageTOCLayout.runtime';

export async function PageTOCLayout(props: ComponentProps<typeof PageTOCLayoutClient>) {
  return (
    <PageTOCLayoutClient {...props} />
  );
}

PageTOCLayout.Anchor = PageTOCLayoutAnchor;
PageTOCLayout.InlineAnchor = PageTOCLayoutInlineAnchor;
PageTOCLayout.Link = PageTOCLayoutLink;
