import {
  compareAsc,
  parse,
} from 'date-fns';
import type { commonWorkplaceFields } from '../schemas';

export namespace compareTimeline {
  export type Timeline = {
    [Key in typeof commonWorkplaceFields[number]]: string
  };
}
export function compareTimeline(
  { to: toARaw }: compareTimeline.Timeline,
  { from: fromBRaw }: compareTimeline.Timeline,
) {
  const now = new Date();
  const [
    toA,
    fromB,
  ] = [
    toARaw,
    fromBRaw,
  ].map((it) => {
    if (/present/i.test(it)) {
      return now;
    }
    const my = parse(it, 'MMMM yyyy', now);
    // eslint-disable-next-line no-restricted-globals, unicorn/prefer-number-properties
    if (isNaN(my as any)) {
      return parse(it, 'yyyy', now);
    }
    return my;
  });
  const comparison = compareAsc(fromB, toA);
  return comparison;
}