import { theme } from '@sabinmarcu/website-theme';
import type { StyleRule } from '@vanilla-extract/css';

type Breakpoints = typeof theme.breakpoint;
export type MediaPrefixType = Exclude<keyof Breakpoints, 'between'>;
export type MediaType = keyof Breakpoints['lt'];
export type BetweenMediaType = keyof Breakpoints['between'];

const getMediaWithOrientation = (
  mediaPortrait: MediaType,
  mediaLandscape: MediaType,
  prefix: MediaPrefixType,
) => [
  `(${theme.breakpoint[prefix][mediaPortrait]} and (orientation: portrait))`,
  `(${theme.breakpoint[prefix][mediaLandscape]} and (orientation: landscape))`,
].join(' or ');

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

export function media<Prefix extends MediaPrefixType>(
  mediaType: MediaType,
  prefixType: Prefix,
): Breakpoints[Prefix][MediaType];
export function media(
  mediaType: BetweenMediaType,
  prefixType: 'between',
): Breakpoints['between'][BetweenMediaType];
export function media(
  mediaType: MediaType | BetweenMediaType,
  prefixType: keyof Breakpoints,
) {
  if (prefixType === 'between') {
    return theme.breakpoint.between[mediaType as BetweenMediaType];
  }
  return theme.breakpoint[prefixType][mediaType as MediaType];
}
