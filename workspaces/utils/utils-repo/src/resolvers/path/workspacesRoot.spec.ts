import { setupFsMockAll } from '@sabinmarcu/utils-test';
import { resolver } from './workspacesRoot';

import compileFixtures from './__mocks__';

const testCases = compileFixtures();

jest.mock('node:fs', jest.requireActual('@sabinmarcu/utils-test').mockFs);
jest.mock('node:fs/promises', jest.requireActual('@sabinmarcu/utils-test').mockFsPromises);

describe('resolver.workspacesRoot', () => {
  describe('sync', () => {
    it('should be a function', () => {
      expect(typeof resolver.sync).toBe('function');
    });
    it('should have one parameter', () => {
      expect(resolver.sync.length).toBe(1);
    });
    describe.each(testCases)(
      '$input',
      ({
        setup, input, output,
      }) => {
        setupFsMockAll(setup);
        it('should return expected', () => {
          expect(resolver.sync(input)).toEqual(output);
        });
      },
    );
  });
  describe('async', () => {
    it('should be a function', () => {
      expect(typeof resolver.async).toBe('function');
    });
    it('should have one parameter', () => {
      expect(resolver.async.length).toBe(1);
    });
    describe.each(testCases)(
      '$input',
      ({
        setup, input, output,
      }) => {
        setupFsMockAll(setup);
        it('should return expected', async () => {
          await expect(resolver.async(input)).resolves.toEqual(output);
        });
      },
    );
  });
});
