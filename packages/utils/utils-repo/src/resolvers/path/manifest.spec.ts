import path from 'node:path';
import { resolver } from './manifest';

describe('resolver.manifest', () => {
  const testCases = [
    { input: 'foo', output: './foo/package.json' },
    { input: 'foo/bar', output: './foo/bar/package.json' },
    { input: 'foo/', output: './foo/package.json' },
  ] as const;
  describe('sync', () => {
    it('should be a function', () => {
      expect(typeof resolver.sync).toBe('function');
    });
    it('should have one parameter', () => {
      expect(resolver.sync.length).toBe(1);
    });
    describe.each(testCases)(
      '$input',
      ({ input, output }) => {
        it('should return expected', () => {
          expect(resolver.sync(input)).toBe(path.resolve(output));
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
      ({ input, output }) => {
        it('should return expected', async () => {
          await expect(resolver.async(input)).resolves.toBe(path.resolve(output));
        });
      },
    );
  });
});
