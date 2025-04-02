import {
  vi,
  describe,
  it,
  expect,
} from 'vitest';

import {
  setupFsMockAll,
} from '@sabinmarcu/utils-test';
import {
  readJson,
  readJsonSync,
} from './readJson.js';

export type ReadJsonFixtures = {
  setup: Record<string, string>,
  input: string,
} & (
  | { expected: string }
  | { error: string }
);

const fixtures = await vi.hoisted(async () => {
  const {
    compileFixtures,
  } = await import('@sabinmarcu/utils-test');
  return compileFixtures<ReadJsonFixtures>(
    new URL('__mocks__/readJson', import.meta.url),
    undefined,
  );
});

vi.mock('node:fs', async () => {
  const utilitiesTest: any = await vi.importActual('@sabinmarcu/utils-test');
  const fsMock = utilitiesTest.mockFs();
  return {
    default: fsMock,
    ...fsMock,
  };
});
vi.mock('node:fs/promises', async () => {
  const utilitiesTest: any = await vi.importActual('@sabinmarcu/utils-test');
  const fsMock = utilitiesTest.mockFsPromises();
  return {
    default: fsMock,
    ...fsMock,
  };
});

describe('readJson', () => {
  describe.each(fixtures)(
    '$name',
    ({
      setup, input, ...outcome
    }) => {
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
  describe.each(fixtures)(
    '$name',
    ({
      setup, input, ...outcome
    }) => {
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
