import {
  describe,
  afterEach,
  it,
  expect,
  vi,
} from 'vitest';
import {
  setupFsMock,
  resetFsMock,
} from '@sabinmarcu/utils-test';
import {
  exists,
} from './exists.js';

export type ExistsFixtures = {
  setup: Record<string, string>,
  input: string,
  expected: boolean,
};

const fixtures = await vi.hoisted(async () => {
  const {
    compileFixtures,
  } = await import('@sabinmarcu/utils-test');
  return compileFixtures<ExistsFixtures>(
    new URL('__mocks__/exists', import.meta.url),
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
