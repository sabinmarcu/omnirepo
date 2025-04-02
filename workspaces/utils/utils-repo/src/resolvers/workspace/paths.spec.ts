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
  resolver as getWorkspacesPaths,
  getWorkspacesPaths as getWorkspacesPathsAsync,
  getWorkspacesPathsSync,
} from './paths.js';

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
    describe('getWorkspacesPathsSync', () => {
      it('should be a function', () => {
        expect(typeof getWorkspacesPathsSync).toBe('function');
      });
    });
    it('should be a function', () => {
      expect(typeof getWorkspacesPaths.sync).toBe('function');
    });
    it('should have one parameter', () => {
      expect(getWorkspacesPaths.sync.length).toBe(1);
    });
    describe.each(fixtures)(
      '$name',
      ({
        setup, input, ...outcome
      }) => {
        setupFsMockAll(setup);
        if ('error' in outcome) {
          it('should throw', () => {
            expect(() => getWorkspacesPaths.sync(input)).toThrow(outcome.error);
          });
        } else {
          it('should return expected', () => {
            expect(getWorkspacesPaths.sync(input)).toEqual(outcome.paths);
          });
        }
      },
    );
  });
  describe('getWorkspacesPaths', () => {
    it('should be a function', () => {
      expect(typeof getWorkspacesPathsAsync).toBe('function');
    });
  });
  describe('async', () => {
    it('should be a function', () => {
      expect(typeof getWorkspacesPaths.async).toBe('function');
    });
    it('should have one parameter', () => {
      expect(getWorkspacesPaths.async.length).toBe(1);
    });
    describe.each(fixtures)(
      '$name',
      ({
        setup, input, ...outcome
      }) => {
        setupFsMockAll(setup);
        if ('error' in outcome) {
          it('should throw', async () => {
            await expect(getWorkspacesPaths.async(input)).rejects.toThrow(outcome.error);
          });
        } else {
          it('should return expected', async () => {
            await expect(getWorkspacesPaths.async(input)).resolves.toEqual(outcome.paths);
          });
        }
      },
    );
  });
});
