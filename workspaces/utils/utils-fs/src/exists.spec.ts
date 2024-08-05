import {
  setupFsMock,
  resetFsMock,
  compileFixtures,
} from '@sabinmarcu/utils-test';
import {
  exists,
} from './exists';

export type ExistsFixtures = {
  setup: Record<string, string>,
  input: string,
  expected: boolean,
};

const fixtures = compileFixtures<ExistsFixtures>(
  new URL('__mocks__/exists', import.meta.url),
);

jest.mock('node:fs', jest.requireActual('@sabinmarcu/utils-test').mockFs);
jest.mock('node:fs/promises', jest.requireActual('@sabinmarcu/utils-test').mockFsPromises);

describe('exists', () => {
  afterEach(resetFsMock);
  it.each(fixtures)(
    '$name',
    async ({
      setup, input, expected,
    }) => {
      setupFsMock(setup);
      expect(await exists(input)).toBe(expected);
    },
  );
});
