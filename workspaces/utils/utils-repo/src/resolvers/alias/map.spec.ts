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
  resolver as getWorkspacesMap,
  getWorkspacesMap as getWorkspacesMapAsync,
  getWorkspacesMapSync,
} from './map.js';

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
  describe('getWorkspacesMapSync', () => {
    it('should be a function', () => {
      expect(typeof getWorkspacesMapSync).toBe('function');
    });
  });
  describe('sync', () => {
    it('should be a function', () => {
      expect(typeof getWorkspacesMap.sync).toBe('function');
    });
    it('should have one parameter', () => {
      expect(getWorkspacesMap.sync.length).toBe(1);
    });
    describe.each(fixtures)(
      '$name',
      ({
        setup, input, ...outcome
      }) => {
        setupFsMockAll(setup);
        if ('error' in outcome) {
          it('should throw', () => {
            expect(() => getWorkspacesMap.sync(input)).toThrow(outcome.error);
          });
        } else {
          it('should return expected', () => {
            expect(getWorkspacesMap.sync(input)).toEqual(outcome.map);
          });
        }
      },
    );
  });
  describe('getWorkspacesMap', () => {
    it('should be a function', () => {
      expect(typeof getWorkspacesMapAsync).toBe('function');
    });
  });
  describe('async', () => {
    it('should be a function', () => {
      expect(typeof getWorkspacesMap.async).toBe('function');
    });
    it('should have one parameter', () => {
      expect(getWorkspacesMap.async.length).toBe(1);
    });
    describe.each(fixtures)(
      '$name',
      ({
        setup, input, ...outcome
      }) => {
        setupFsMockAll(setup);
        if ('error' in outcome) {
          it('should throw', async () => {
            await expect(getWorkspacesMap.async(input)).rejects.toThrow(outcome.error);
          });
        } else {
          it('should return expected', async () => {
            await expect(getWorkspacesMap.async(input)).resolves.toEqual(outcome.map);
          });
        }
      },
    );
  });
});
