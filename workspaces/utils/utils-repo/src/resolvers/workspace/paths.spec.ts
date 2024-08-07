import {
  setupFsMockAll,
  vol,
} from '@sabinmarcu/utils-test';
import {
  resolver as getWorkspacesPaths,
  getWorkspacesPaths as getWorkspacesPathsAsync,
  getWorkspacesPathsSync,
} from './paths.js';

import compileFixtures from './__mocks__.js';

const fixtures = compileFixtures();

jest.mock('node:fs', jest.requireActual('@sabinmarcu/utils-test').mockFs);
jest.mock('node:fs/promises', jest.requireActual('@sabinmarcu/utils-test').mockFsPromises);
jest.mock('glob', () => (
  jest.requireActual('@sabinmarcu/utils-test').mockGlob(vol, jest.requireActual('glob'))
));

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
