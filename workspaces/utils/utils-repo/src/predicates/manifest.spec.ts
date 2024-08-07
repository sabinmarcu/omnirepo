import {
  setupFsMockAll,
} from '@sabinmarcu/utils-test';

import {
  testSync,
  test as testAsync,
  predicate,
} from './manifest.js';

import compileFixtures from './__mocks__/manifest.js';

const fixtures = compileFixtures();

jest.mock('node:fs', jest.requireActual('@sabinmarcu/utils-test').mockFs);
jest.mock('node:fs/promises', jest.requireActual('@sabinmarcu/utils-test').mockFsPromises);

describe('predicates.manifest', () => {
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
