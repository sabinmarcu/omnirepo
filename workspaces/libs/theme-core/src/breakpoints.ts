import { staticGenerator } from './descriptors.js';
import type { StaticDescriptor } from './types.js';

type BreakpointEntry = readonly [string, number];
type EntryName<Entry extends BreakpointEntry> = Entry[0];
type EntryValue<Entry extends BreakpointEntry> = Entry[1];
type EntriesName<Entries extends readonly BreakpointEntry[]> = EntryName<Entries[number]>;
type ValueFor<Entries extends readonly BreakpointEntry[], Name extends string> =
  EntryValue<Extract<Entries[number], readonly [Name, number]>>;
type Pixel<Value extends number> = `${Value}px`;

type LessThan<Entries extends readonly BreakpointEntry[]> = {
  readonly [Name in EntriesName<Entries>]: `(width < ${Pixel<ValueFor<Entries, Name>>})`;
};
type GreaterThan<Entries extends readonly BreakpointEntry[]> = {
  readonly [Name in EntriesName<Entries>]: `(width > ${Pixel<ValueFor<Entries, Name>>})`;
};
type LessThanOrEqual<Entries extends readonly BreakpointEntry[]> = {
  readonly [Name in EntriesName<Entries>]: `(max-width: ${Pixel<ValueFor<Entries, Name>>})`;
};
type GreaterThanOrEqual<Entries extends readonly BreakpointEntry[]> = {
  readonly [Name in EntriesName<Entries>]: `(min-width: ${Pixel<ValueFor<Entries, Name>>})`;
};
type BetweenFirst<First extends BreakpointEntry, Rest extends readonly BreakpointEntry[]> = {
  readonly [Right in EntriesName<Rest> as `${EntryName<First>}-${Right}`]:
    `(${Pixel<EntryValue<First>>} < width < ${Pixel<ValueFor<Rest, Right>>})`;
};
type Simplify<Value> = { readonly [Key in keyof Value]: Value[Key] };
type Between<Entries extends readonly BreakpointEntry[]> =
  Entries extends readonly [infer First extends BreakpointEntry,
    ...infer Rest extends BreakpointEntry[]]
    ? Simplify<BetweenFirst<First, Rest> & Between<Rest>>
    : {};

export type BreakpointOutput<Entries extends readonly BreakpointEntry[]> = {
  readonly lt: LessThan<Entries>;
  readonly gt: GreaterThan<Entries>;
  readonly lte: LessThanOrEqual<Entries>;
  readonly gte: GreaterThanOrEqual<Entries>;
  readonly between: Between<Entries>;
};

const invalidEntries = (reason: string): never => {
  throw new TypeError(`Invalid breakpoint entries: ${reason}`);
};

/** Creates static media-query helpers from ordered, named pixel breakpoints. */
export function breakpointGenerator<const Entries extends readonly BreakpointEntry[]>(
  entries: Entries,
): StaticDescriptor<BreakpointOutput<Entries>> {
  const names = new Set<string>();
  let previous = -Infinity;

  for (const [name, threshold] of entries) {
    if (name.length === 0) invalidEntries('names must not be empty');
    if (names.has(name)) invalidEntries(`duplicate name "${name}"`);
    if (!Number.isFinite(threshold) || threshold < 0) {
      invalidEntries(`threshold for "${name}" must be a finite non-negative number`);
    }
    if (threshold <= previous) invalidEntries('thresholds must be in strictly ascending order');
    names.add(name);
    previous = threshold;
  }

  const lt = Object.create(null) as Record<string, string>;
  const gt = Object.create(null) as Record<string, string>;
  const lte = Object.create(null) as Record<string, string>;
  const gte = Object.create(null) as Record<string, string>;
  const between = Object.create(null) as Record<string, string>;

  for (let left = 0; left < entries.length; left += 1) {
    const [leftName, leftValue] = entries[left]!;
    lt[leftName] = `(width < ${leftValue}px)`;
    gt[leftName] = `(width > ${leftValue}px)`;
    lte[leftName] = `(max-width: ${leftValue}px)`;
    gte[leftName] = `(min-width: ${leftValue}px)`;

    for (let right = left + 1; right < entries.length; right += 1) {
      const [rightName, rightValue] = entries[right]!;
      const range = `${leftName}-${rightName}`;
      if (Object.hasOwn(between, range)) invalidEntries(`colliding range name "${range}"`);
      between[range] = `(${leftValue}px < width < ${rightValue}px)`;
    }
  }

  return staticGenerator({
    lt,
    gt,
    lte,
    gte,
    between,
  }) as StaticDescriptor<BreakpointOutput<Entries>>;
}
