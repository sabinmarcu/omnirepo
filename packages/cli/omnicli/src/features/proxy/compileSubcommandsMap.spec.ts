import { compileSubcommandsMap } from './compileSubcommandsMap';
import { testSubcommands } from '../__mocks__/list';
import { Test1 } from '../__mocks__/test1';
import { Test2 } from '../__mocks__/test2';

describe('compileSubcommandsMap', () => {
  it('should be a function', () => {
    expect(typeof compileSubcommandsMap).toBe('function');
  });
  it('should have one parameter', () => {
    expect(compileSubcommandsMap.length).toBe(1);
  });
  it('should run on the one test', () => {
    const map = compileSubcommandsMap(testSubcommands);
    expect(Object.keys(map)).toEqual(['test1', 'test2', 'test3']);
    expect(map.test1).toEqual(Test1);
    expect(map.test2).toEqual(Test2);
    expect(map.test3).toEqual(Test2);
  });
});
