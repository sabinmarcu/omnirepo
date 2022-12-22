import {
  setupFsMockAll,
  vol,
} from '@sabinmarcu/utils-test';
import { resolver as getWorkspacesNames } from './names';

import compileFixtures from './__mocks__';

const fixtures = compileFixtures();

jest.mock('node:fs', jest.requireActual('@sabinmarcu/utils-test').mockFs);
jest.mock('node:fs/promises', jest.requireActual('@sabinmarcu/utils-test').mockFsPromises);
jest.mock('glob', () => {
  const glob = jest.requireActual('glob');
  const mockGlob = (pattern: string, options: any, callback: any) => (
    glob(pattern, { ...options, fs: vol }, callback)
  );
  const mockGlobSync = (pattern: string, options: any) => (
    glob.sync(pattern, { ...options, fs: vol })
  );
  mockGlob.sync = mockGlobSync;
  return mockGlob;
});

describe('getWorkspaces.paths', () => {
  describe('sync', () => {
    it('should be a function', () => {
      expect(typeof getWorkspacesNames.sync).toBe('function');
    });
    it('should have one parameter', () => {
      expect(getWorkspacesNames.sync.length).toBe(1);
    });
    describe.each(fixtures)(
      '$name',
      ({ setup, input, ...outcome }) => {
        setupFsMockAll(setup);
        if ('error' in outcome) {
          it('should throw', () => {
            expect(() => getWorkspacesNames.sync(input)).toThrow(outcome.error);
          });
        } else {
          it('should return expected', () => {
            expect(getWorkspacesNames.sync(input)).toEqual(outcome.names);
          });
        }
      },
    );
  });
  describe('async', () => {
    it('should be a function', () => {
      expect(typeof getWorkspacesNames.async).toBe('function');
    });
    it('should have one parameter', () => {
      expect(getWorkspacesNames.async.length).toBe(1);
    });
    describe.each(fixtures)(
      '$name',
      ({ setup, input, ...outcome }) => {
        setupFsMockAll(setup);
        if ('error' in outcome) {
          it('should throw', async () => {
            await expect(getWorkspacesNames.async(input)).rejects.toThrow(outcome.error);
          });
        } else {
          it('should return expected', async () => {
            await expect(getWorkspacesNames.async(input)).resolves.toEqual(outcome.names);
          });
        }
      },
    );
  });
});
