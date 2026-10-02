import {
  css,
  numberCodec,
  source,
  variableGenerator,
} from '../descriptors.js';
import type {
  Expression,
  Source,
  VariableDescriptor,
} from '../types.js';

type GridUnit = 'rem' | 'px' | 'em';
type IsNonNegativeInteger<Value extends number> = `${Value}` extends `-${string}` | `${string}.${string}`
  ? false
  : true;

type PairTokens<
  Pairs extends number,
  Prefix extends string = '',
  Current extends readonly unknown[] = [],
> = number extends Pairs
  ? Readonly<Record<`${string}s` | `${string}l`, Expression>>
  : IsNonNegativeInteger<Pairs> extends false
    ? {}
    : Current['length'] extends Pairs
      ? {}
      : Readonly<{
        [Key in `${Prefix}s` | `${Prefix}l`]: Expression;
      }> & PairTokens<Pairs, `x${Prefix}`, [...Current, unknown]>;
export type GridTokens<Pairs extends number> = Readonly<{
  m: Expression;
}> & PairTokens<Pairs>;

export type GridGeneratorOptions<Pairs extends number = number> = Readonly<{
  pairs?: Pairs;
  default?: number;
  unit?: GridUnit;
  basis?: number;
}>;

type PairCoefficients = readonly [small: number, large: number];

type GridDescriptor<Pairs extends number> = VariableDescriptor<
  Source<number, true>,
  GridTokens<Pairs>,
  'shared'
>;

const invalidGrid = (reason: string): never => {
  throw new TypeError(`Invalid grid options: ${reason}`);
};

const assertFinite = (value: number, name: string) => {
  if (!Number.isFinite(value)) invalidGrid(`${name} must be a finite number`);
};

const createGridGenerator = <const Pairs extends number>(
  options: GridGeneratorOptions<Pairs>,
  coefficients: (index: number) => PairCoefficients,
): GridDescriptor<Pairs> => {
  const pairs = options.pairs ?? 3;
  const unit = options.unit ?? 'rem';
  const defaultValue = options.default ?? 16;
  const basis = options.basis ?? (unit === 'rem' ? 16 : 1);

  if (!Number.isInteger(pairs) || pairs < 0) {
    invalidGrid('pairs must be a non-negative integer');
  }
  assertFinite(defaultValue, 'default');
  assertFinite(basis, 'basis');
  if (basis <= 0) invalidGrid('basis must be greater than zero');

  return variableGenerator({
    scope: 'shared',
    sources: source(numberCodec, defaultValue),
    build: (base) => {
      const tokens: Record<string, Expression> = {
        m: css`calc(${base} / ${basis} * 1${unit})`,
      };
      for (let index = 0; index < pairs; index += 1) {
        const prefix = 'x'.repeat(index);
        const [small, large] = coefficients(index);
        tokens[`${prefix}s`] = css`calc(${base} / ${basis} / ${small} * 1${unit})`;
        tokens[`${prefix}l`] = css`calc(${base} / ${basis} * ${large} * 1${unit})`;
      }
      return { tokens: tokens as GridTokens<Pairs> };
    },
  }) as GridDescriptor<Pairs>;
};

const eightPointCoefficients = (index: number): PairCoefficients => [
  2 ** (index + 1),
  1 + (index + 1) / 2,
];

/** Creates the shared eight-point spacing scale from one unitless numeric source. */
export function eightPointGridGenerator<const Pairs extends number = 3>(
  options: GridGeneratorOptions<Pairs> = {},
): GridDescriptor<Pairs> {
  return createGridGenerator(options, eightPointCoefficients);
}

/** Creates the shared Fibonacci-ratio spacing scale from one unitless numeric source. */
export function fibonacciGridGenerator<const Pairs extends number = 3>(
  options: GridGeneratorOptions<Pairs> = {},
): GridDescriptor<Pairs> {
  let previous = 1;
  let current = 2;
  return createGridGenerator(options, () => {
    const ratio = current;
    current += previous;
    previous = ratio;
    return [ratio, ratio];
  });
}

export const gridGenerator = eightPointGridGenerator;
