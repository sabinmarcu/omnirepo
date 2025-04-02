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
  resolver as getAliasesNames,
  getAliasesNames as getAliasesNamesAsync,
  getAliasesNamesSync,
} from './names.js';

const fixtures = await vi.hoisted(async () => {
  const compileFixtures = await import('./__mocks__/index.js');
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
vi.mock('glob', async (importOriginal) => {
  const utilitiesTest: any = await vi.importActual('@sabinmarcu/utils-test');
  const originalGlob: any = await importOriginal();
  const globMock = utilitiesTest.mockGlob(utilitiesTest.vol, originalGlob.default);
  return {
    ...originalGlob,
    glob: globMock,
    default: globMock,
  };
});

describe('getWorkspaces.paths', () => {
  describe('sync', () => {
    describe('getAliasesNamesSync', () => {
      it('should be a function', () => {
        expect(typeof getAliasesNamesSync).toBe('function');
      });
    });
    it('should be a function', () => {
      expect(typeof getAliasesNames.sync).toBe('function');
    });
    it('should have one parameter', () => {
      expect(getAliasesNames.sync.length).toBe(1);
    });
    describe.each(fixtures)(
      '$name',
      ({
        setup, input, ...outcome
      }) => {
        setupFsMockAll(setup);
        if ('error' in outcome) {
          it('should throw', () => {
            expect(() => getAliasesNames.sync(input)).toThrow(outcome.error);
          });
        } else {
          it('should return expected', () => {
            expect(getAliasesNames.sync(input)).toEqual(outcome.names);
          });
        }
      },
    );
  });
  describe('getAliasesNames', () => {
    it('should be a function', () => {
      expect(typeof getAliasesNamesAsync).toBe('function');
    });
  });
  describe('async', () => {
    it('should be a function', () => {
      expect(typeof getAliasesNames.async).toBe('function');
    });
    it('should have one parameter', () => {
      expect(getAliasesNames.async.length).toBe(1);
    });
    describe.each(fixtures)(
      '$name',
      ({
        setup, input, ...outcome
      }) => {
        setupFsMockAll(setup);
        if ('error' in outcome) {
          it('should throw', async () => {
            await expect(getAliasesNames.async(input)).rejects.toThrow(outcome.error);
          });
        } else {
          it('should return expected', async () => {
            await expect(getAliasesNames.async(input)).resolves.toEqual(outcome.names);
          });
        }
      },
    );
  });
});
