import { defaultRemSize } from './grid.constants.js';
import type {
  Grid,
} from './grid.type.js';
import type { ThemeGenerator } from './types.js';

const fibonacciMap = new Map<number, number>([[0, 0], [1, 1]]);

const fibonacciSequence = (index: number) => {
  if (index < 0) {
    return 0;
  }
  const existing = fibonacciMap.get(index);
  if (existing) {
    return existing;
  }

  const current: number = fibonacciSequence(index - 2) + fibonacciSequence(index - 1);
  fibonacciMap.set(index, current);
  return current;
};

const gridOfIndex = (index: number) => {
  const current = fibonacciSequence(index);
  return [current * -1, current];
};

const rem = (input: number) => (`${input / defaultRemSize}rem`);

// @ts-ignore
export const gridGenerator = <Amount extends number = 3>(
  amount: Amount = 3 as any,
) => (
    (
      inputSize: number,
    ): Grid<Amount> => {
      let result: Grid<Amount> = {
        m: rem(inputSize),
      } as any;

      if (amount === 0) {
        return result;
      }

      for (const index of Array.from({ length: amount }).map((_, index_) => index_)) {
        const namePrefix = Array.from({ length: index }).fill('x').join('');
        const [xs, xl] = gridOfIndex(5 + index);
        result = {
          ...result,
          [`${namePrefix}s`]: rem(xs + inputSize),
          [`${namePrefix}l`]: rem(xl + inputSize),
        };
      }

      return result;
      // @ts-ignore
    }) satisfies ThemeGenerator<number>;
