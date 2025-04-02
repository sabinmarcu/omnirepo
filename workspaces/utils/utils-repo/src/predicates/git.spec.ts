import {
  describe,
  it,
  expect,
  vi,
} from 'vitest';
import {
  setupFsMockAll,
} from '@sabinmarcu/utils-test';

import {
  testSync,
  test as testAsync,
  predicate,
} from './git.js';

const fixtures = await vi.hoisted(async () => {
  const compileFixtures = await import('./__mocks__/git/index.js');
  return compileFixtures.default();
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

describe('predicates.git', () => {
  describe('testSync', () => {
    it('should be a function', () => {
      expect(typeof testSync).toBe('function');
    });
  });
  describe('sync', () => {
    it('should be a function', () => {
      expect(typeof predicate.sync).toBe('function');
    });
    it('should have one parameters', () => {
      expect(predicate.sync.length).toBe(1);
    });
    describe.each(fixtures)(
      '$name',
      ({
        setup, input, output,
      }) => {
        setupFsMockAll(setup);
        it('should return expected', () => {
          expect(predicate.sync(input)).toBe(output);
        });
      },
    );
  });
  describe('test', () => {
    it('should be a function', () => {
      expect(typeof testAsync).toBe('function');
    });
  });
  describe('async', () => {
    it('should be a function', () => {
      expect(typeof predicate.async).toBe('function');
    });
    it('should have one parameters', () => {
      expect(predicate.async.length).toBe(1);
    });
    describe.each(fixtures)(
      '$name',
      ({
        setup, input, output,
      }) => {
        setupFsMockAll(setup);
        it('should return expected', async () => {
          await expect(predicate.async(input)).resolves.toBe(output);
        });
      },
    );
  });
});
