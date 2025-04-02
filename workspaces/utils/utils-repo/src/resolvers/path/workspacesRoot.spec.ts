import {
  describe,
  it,
  expect,
  vi,
} from 'vitest';
import { setupFsMockAll } from '@sabinmarcu/utils-test';
import { resolver } from './workspacesRoot.js';

const testCases = await vi.hoisted(async () => {
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
