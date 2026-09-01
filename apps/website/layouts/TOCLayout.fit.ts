import type { StyleRule } from '@vanilla-extract/css';
import { globalStyle } from '@vanilla-extract/css';
import { rootViewportContainer } from './RootPageLayout.css';
import {
  pageLayoutLargeSelector,
  pageLayoutSizes,
} from './PageLayout.css';

/** Narrowest the TOC is allowed to render at before it collapses into an overlay. */
export const tocMinInlineSize = 300;

/**
 * The TOC only renders beside the content when both gutters can hold it,
 * so the content column stays centred and identically placed either way.
 */
const inlineTOCScopes = [
  {
    pageSize: pageLayoutSizes.base,
    scope: `body:not(:has(${pageLayoutLargeSelector}))`,
  },
  {
    pageSize: pageLayoutSizes.large,
    scope: `body:has(${pageLayoutLargeSelector})`,
  },
] as const;

const fitsAt = (pageSize: number) => pageSize + tocMinInlineSize * 2;

const atFit = (
  bound: 'min' | 'max',
  selector: string,
  rule: StyleRule,
) => {
  for (const { pageSize, scope } of inlineTOCScopes) {
    const size = bound === 'min' ? fitsAt(pageSize) : fitsAt(pageSize) - 1;
    globalStyle(`${scope} ${selector}`, {
      '@container': {
        [`${rootViewportContainer} (${bound}-inline-size: ${size}px)`]: rule,
      },
    });
  }
};

export const whenTOCFits = (
  selector: string,
  rule: StyleRule,
) => atFit('min', selector, rule);

export const whenTOCDoesNotFit = (
  selector: string,
  rule: StyleRule,
) => atFit('max', selector, rule);
