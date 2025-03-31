import {
  setupFsMockAll,
  vol,
} from '@sabinmarcu/utils-test';
import {
  resolver as getWorkspacesMap,
  getWorkspacesMap as getWorkspacesMapAsync,
  getWorkspacesMapSync,
} from './map.js';

import compileFixtures from './__mocks__/index.js';

const fixtures = compileFixtures();

jest.mock('node:fs', jest.requireActual('@sabinmarcu/utils-test').mockFs);
jest.mock('node:fs/promises', jest.requireActual('@sabinmarcu/utils-test').mockFsPromises);
jest.mock('glob', () => (
  jest.requireActual('@sabinmarcu/utils-test').mockGlob(vol, jest.requireActual('glob'))
));

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
