import { theme } from '@sabinmarcu/theme';
import type { StyleRule } from '@vanilla-extract/css';

type GTMediaTypes = keyof typeof theme.breakpoint & `gt-${string}`;
export type MediaPrefixType = Exclude<
  keyof typeof theme.breakpoint extends `${infer Prefix}-${string}`
    ? Prefix
    : unknown,
  'between'
>;

export type MediaType = GTMediaTypes extends `gt-${infer Media}`
  ? Media
  : unknown;

const getMediaWithOrientation = (
  mediaPortrait: MediaType,
  mediaLandscape: MediaType,
  prefix: MediaPrefixType,
) => [
  [theme.breakpoint[`${prefix}-${mediaPortrait}`], '(orientation: portrait)'],
  [theme.breakpoint[`${prefix}-${mediaLandscape}`], '(orientation: landscape)'],
].map((it) => `(${it.join(' and ')})`).join(' or ');

const getMediaWithGtLtOrientation = (
  mediaPortrait: MediaType,
  mediaLandscape: MediaType,
) => ({
  lt: getMediaWithOrientation(
    mediaPortrait,
    mediaLandscape,
    'lt',
  ),
  gt: getMediaWithOrientation(
    mediaPortrait,
    mediaLandscape,
    'gt',
  ),
});

const mobileGtLtOrientation = getMediaWithGtLtOrientation('mobile', 'tablet');

export const mobileMedia = <T extends StyleRule>(styles: T, min = false) => ({
  '@container': {
    [min ? mobileGtLtOrientation.gt : mobileGtLtOrientation.lt]: styles,
  },
} as const);

export const media = (
  mediaType: MediaType,
  prefixType: MediaPrefixType,
) => theme.breakpoint[`${prefixType}-${mediaType}`];
