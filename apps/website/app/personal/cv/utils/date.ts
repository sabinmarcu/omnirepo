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
  const [
    toA,
    fromB,
  ] = [
    toARaw,
    fromBRaw,
  ].map((it) => parse(it, 'MMMM yyyy', new Date()));
  const comparison = compareAsc(fromB, toA);
  return comparison;
}
