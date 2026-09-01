import type { StyleRule } from '@vanilla-extract/css';
import { globalStyle } from '@vanilla-extract/css';
import { rootViewportContainer } from './RootPageLayout.css';
import {
  pageLayoutLargeSelector,
  pageLayoutMinSize,
  pageLayoutSizes,
} from './PageLayout.css';

/** Narrowest the TOC rail is allowed to render at before it collapses behind a trigger. */
export const tocMinInlineSize = 350;

/**
 * TOC layout tiers, widest first:
 * - `centered`: the rail fits without pushing content off-centre.
 * - `folded`: the rail keeps its size and the content column compresses instead.
 * - `drawer`: the rail no longer fits, so the TOC collapses behind a trigger.
 */
export const tocLayoutTiers = ['centered', 'folded', 'drawer'] as const;
export type TOCLayoutTier = typeof tocLayoutTiers[number];

/** Only the `centered` floor depends on the variant, so every tier is emitted once per variant. */
const variantScopes = [
  {
    maxSize: pageLayoutSizes.base,
    scope: `body:not(:has(${pageLayoutLargeSelector}))`,
  },
  {
    maxSize: pageLayoutSizes.large,
    scope: `body:has(${pageLayoutLargeSelector})`,
  },
] as const;

const tierFloors = (maxSize: number): Record<TOCLayoutTier, number> => ({
  centered: maxSize + tocMinInlineSize * 2,
  folded: pageLayoutMinSize + tocMinInlineSize,
  drawer: 0,
});

// Range syntax, so fractional container widths cannot fall between two tiers.
const tierQuery = (tier: TOCLayoutTier, maxSize: number) => {
  const floors = tierFloors(maxSize);
  const index = tocLayoutTiers.indexOf(tier);
  const conditions: string[] = [];
  if (floors[tier] > 0) {
    conditions.push(`(inline-size >= ${floors[tier]}px)`);
  }
  if (index > 0) {
    conditions.push(`(inline-size < ${floors[tocLayoutTiers[index - 1]]}px)`);
  }
  return conditions.join(' and ');
};

export const whenTier = (
  tier: TOCLayoutTier | readonly TOCLayoutTier[],
  selector: string,
  rule: StyleRule,
) => {
  const tiers = Array.isArray(tier) ? tier : [tier as TOCLayoutTier];
  for (const current of tiers) {
    for (const { maxSize, scope } of variantScopes) {
      globalStyle(`${scope} ${selector}`, {
        '@container': {
          [`${rootViewportContainer} ${tierQuery(current, maxSize)}`]: rule,
        },
      });
    }
  }
};
