import {
  setupFsMockAll,
  vol,
} from '@sabinmarcu/utils-test';
import {
  resolver as getAliasesNames,
  getAliasesNames as getAliasesNamesAsync,
  getAliasesNamesSync,
} from './names.js';

import compileFixtures from './__mocks__/index.js';

const fixtures = compileFixtures();

jest.mock('node:fs', jest.requireActual('@sabinmarcu/utils-test').mockFs);
jest.mock('node:fs/promises', jest.requireActual('@sabinmarcu/utils-test').mockFsPromises);
jest.mock('glob', () => (
  jest.requireActual('@sabinmarcu/utils-test').mockGlob(vol, jest.requireActual('glob'))
));

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
