import { isSubcommandOf } from './isSubcommandOf.js';
import { testSubcommands } from '../__mocks__/list';

describe('isSubcommandOf', () => {
  it('should be a function', () => {
    expect(typeof isSubcommandOf).toBe('function');
  });
  it('should have one parameter', () => {
    expect(isSubcommandOf.length).toBe(1);
  });
  describe('instanced', () => {
    const isValidSubcommand = isSubcommandOf(testSubcommands);
    it('should be a function', () => {
      expect(typeof isValidSubcommand).toBe('function');
    });
    it('should have one parameter', () => {
      expect(isValidSubcommand.length).toBe(1);
    });
    it('should return true for test1', () => {
      expect(isValidSubcommand('test1')).toBe(true);
    });
    it('should return true for test2', () => {
      expect(isValidSubcommand('test2')).toBe(true);
    });
    it('should return true for test3', () => {
      expect(isValidSubcommand('test3')).toBe(true);
    });
    it('should return true for test4', () => {
      expect(isValidSubcommand('test4')).toBe(true);
    });
    it('should return false for test5', () => {
      expect(isValidSubcommand('test5')).toBe(false);
    });
    it('should return true for test5:test6', () => {
      expect(isValidSubcommand('test5:test6')).toBe(true);
    });
  });
});
