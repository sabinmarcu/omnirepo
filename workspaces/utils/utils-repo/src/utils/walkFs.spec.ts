import compileFixtures from './__mocks__/index.js';
import {
  walker,
  walkFs,
  walkFsSync,
} from './walkFs.js';

const fixtures = compileFixtures();

describe('walker', () => {
  describe('walkFsSync', () => {
    it('should be a function', () => {
      expect(walkFsSync).toBeInstanceOf(Function);
    });
  });
  describe('sync', () => {
    it('should be a function', () => {
      expect(walker.sync).toBeInstanceOf(Function);
    });
    it('should have three parameters', () => {
      expect(walker.sync.length).toBe(3);
    });
    describe.each(fixtures)(
      '$name',
      ({
        input, ...result
      }) => {
        if ('error' in result) {
          it('should throw an error', () => {
            expect(() => walker.sync(...input)).toThrow(result.error);
          });
        } else {
          it('should return the expected value', () => {
            expect(walker.sync(...input)).toBe(result.output);
          });
        }
      },
    );
  });
  describe('walkFs', () => {
    it('should be a function', () => {
      expect(walkFs).toBeInstanceOf(Function);
    });
  });
  describe('async', () => {
    it('should be a function', () => {
      expect(walker.async).toBeInstanceOf(Function);
    });
    it('should have three parameters', () => {
      expect(walker.async.length).toBe(3);
    });
    describe.each(fixtures)(
      '$name',
      ({
        input, ...result
      }) => {
        const testInput = input as unknown as Parameters<typeof walker.async>;
        if ('error' in result) {
          it('should throw an error', async () => {
            await expect(walker.async(...testInput)).rejects.toThrow(result.error);
          });
        } else {
          it('should return the expected value', async () => {
            await expect(walker.async(...testInput)).resolves.toBe(result.output);
          });
        }
      },
    );
  });
});
