import { compileFixtures } from '@sabinmarcu/utils-test';
import type { StringCases } from '../types.js';

type ConversionSetFixtureType = {
  [Key in StringCases]: string;
};

const fixtures = compileFixtures<ConversionSetFixtureType>(
  new URL('../__fixtures__', import.meta.url),
  ['index.ts'],
);

export default fixtures;
