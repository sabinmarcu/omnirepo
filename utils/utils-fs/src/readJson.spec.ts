import {
  setupFsMockAll,
  resetFsMock,
  compileFixtures,
} from '@sabinmarcu/utils-test';
import {
  readJson,
  readJsonSync,
} from './readJson';

export type ReadJsonFixtures = {
  setup: Record<string, string>,
  input: string,
} & (
  | { expected: string }
  | { error: string }
);

const fixtures = compileFixtures<ReadJsonFixtures>(
  new URL('__mocks__/readJson', import.meta.url),
);

jest.mock('node:fs', jest.requireActual('@sabinmarcu/utils-test').mockFs);
jest.mock('node:fs/promises', jest.requireActual('@sabinmarcu/utils-test').mockFsPromises);

describe('readJson', () => {
  afterEach(resetFsMock);
  describe.each(fixtures)(
    '$name',
    ({ setup, input, ...outcome }) => {
      setupFsMockAll(setup);
      if ('error' in outcome) {
        const { error } = outcome;
        it('throws error', async () => {
          await expect(readJson(input)).rejects.toThrow(error);
        });
      } else {
        const { expected } = outcome;
        it('returns expected', async () => {
          await expect(readJson(input)).resolves.toEqual(expected);
        });
      }
    },
  );
});

describe('readJsonSync', () => {
  afterEach(resetFsMock);
  describe.each(fixtures)(
    '$name',
    ({ setup, input, ...outcome }) => {
      setupFsMockAll(setup);
      if ('error' in outcome) {
        const { error } = outcome;
        it('throws error', () => {
          expect(() => readJsonSync(input)).toThrow(error);
        });
      } else {
        const { expected } = outcome;
        it('returns expected', () => {
          expect(readJsonSync(input)).toEqual(expected);
        });
      }
    },
  );
});
