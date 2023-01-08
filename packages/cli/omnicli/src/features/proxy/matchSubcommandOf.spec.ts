import { testSubcommands } from '../__mocks__/list';
import { Test1 } from '../__mocks__/test1';
import { Test2 } from '../__mocks__/test2';
import { Test3 } from '../__mocks__/test3';
import { matchSubcommandOf } from './matchSubcommandOf';

describe('matchSubcommandOf', () => {
  it('should be a function', () => {
    expect(typeof matchSubcommandOf).toBe('function');
  });
  it('should have one parameter', () => {
    expect(matchSubcommandOf.length).toBe(1);
  });
  describe('matchSubcommand', () => {
    const matchSubcommand = matchSubcommandOf(testSubcommands);
    it('should be a function', () => {
      expect(typeof matchSubcommand).toBe('function');
    });
    it('should have one parameter', () => {
      expect(matchSubcommand.length).toBe(1);
    });
    describe.each([
      { input: ['test1'], output: [['test1'], []] },
      { input: ['test1', 'some', 'stuff'], output: [['test1'], ['some', 'stuff']] },
      { input: ['test2', 'some', 'stuff'], output: [['test2'], ['some', 'stuff']] },
      { input: ['test3', 'some', 'stuff'], output: [['test3'], ['some', 'stuff']] },
      { input: ['test4', 'some', 'stuff'], output: ['test4', ['some', 'stuff']] },
      { input: ['test5', 'some', 'stuff'], error: true },
      { input: ['test5', 'test6'], output: [['test5', 'test6'], []] },
      { input: ['test5', 'test6', 'some', 'stuff'], output: [['test5', 'test6'], ['some', 'stuff']] },
    ])(
      'matchSubcommand($input)',
      ({ input, ...rest }) => {
        if ('error' in rest) {
          it('should throw an error', () => {
            expect(() => matchSubcommand(input)).toThrow();
          });
        } else {
          it('should return the correct value', () => {
            expect(matchSubcommand(input)).toEqual(rest.output);
          });
        }
      },
    );
  });
});
