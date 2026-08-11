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

const rem = (input: number) => (`${input / defaultRemSize}rem`);

type GridPairGenerator = (index: number, inputSize: number) => [number, number];

const createGridGenerator = <Amount extends number = 3>(
  pairGenerator: GridPairGenerator,
  amount: Amount = 3 as any,
) => {
  const fixedGenerator = ((() => {
    const generator = (
      inputSize: number,
    ): Grid<Amount> => {
      let result: Grid<Amount> = {
        m: rem(inputSize),
      } as any;

      if (amount === 0) {
        return result;
      }

      for (const index of Array.from({ length: amount }, (_, index_) => index_)) {
        const namePrefix = 'x'.repeat(index);
        const [smallValue, largeValue] = pairGenerator(index, inputSize);
        result = {
          ...result,
          [`${namePrefix}s`]: rem(smallValue),
          [`${namePrefix}l`]: rem(largeValue),
        };
      }

      return result;
    };
    generator.default = 'm';
    return generator;
    // @ts-ignore
  })()) satisfies ThemeGenerator<number>;
  return fixedGenerator;
};

const fibonacciGridPair: GridPairGenerator = (index) => {
  const current = fibonacciSequence(5 + index);
  return [defaultRemSize - current, defaultRemSize + current];
};

const eightPointGridPair: GridPairGenerator = (index, inputSize) => {
  const smallValue = inputSize / (2 ** (index + 1));
  const largeValue = inputSize + (inputSize / 2) * (index + 1);
  return [smallValue, largeValue];
};

export const fibonacciGridGenerator = <Amount extends number = 3>(
  amount: Amount = 3 as any,
) => createGridGenerator(fibonacciGridPair, amount);

export const eightPointGridGenerator = <Amount extends number = 3>(
  amount: Amount = 3 as any,
) => createGridGenerator(eightPointGridPair, amount);

export const gridGenerator = eightPointGridGenerator;
