import {
  setupFsMockAll,
  vol,
} from '@sabinmarcu/utils-test';
import {
  resolver as getWorkspacesNames,
  getWorkspacesNames as getWorkspacesNamesAsync,
  getWorkspacesNamesSync,
} from './names.js';

import compileFixtures from './__mocks__.js';

const fixtures = compileFixtures();

jest.mock('node:fs', jest.requireActual('@sabinmarcu/utils-test').mockFs);
jest.mock('node:fs/promises', jest.requireActual('@sabinmarcu/utils-test').mockFsPromises);
jest.mock('glob', () => (
  jest.requireActual('@sabinmarcu/utils-test').mockGlob(vol, jest.requireActual('glob'))
));

describe('getWorkspaces.paths', () => {
  describe('sync', () => {
    describe('getWorkspacesNamesSync', () => {
      it('should be a function', () => {
        expect(typeof getWorkspacesNamesSync).toBe('function');
      });
    });
    it('should be a function', () => {
      expect(typeof getWorkspacesNames.sync).toBe('function');
    });
    it('should have one parameter', () => {
      expect(getWorkspacesNames.sync.length).toBe(1);
    });
    describe.each(fixtures)(
      '$name',
      ({
        setup, input, ...outcome
      }) => {
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
  describe('getWorkspacesNames', () => {
    it('should be a function', () => {
      expect(typeof getWorkspacesNamesAsync).toBe('function');
    });
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
      ({
        setup, input, ...outcome
      }) => {
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
