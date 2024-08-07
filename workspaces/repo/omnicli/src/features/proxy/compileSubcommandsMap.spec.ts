import { compileSubcommandsMap } from './compileSubcommandsMap.js';
import { testSubcommands } from '../__mocks__/list.js';
import { Test1 } from '../__mocks__/test1.js';
import { Test2 } from '../__mocks__/test2.js';
import { Test3 } from '../__mocks__/test3.js';

describe('compileSubcommandsMap', () => {
  it('should be a function', () => {
    expect(typeof compileSubcommandsMap).toBe('function');
  });
  it('should have one parameter', () => {
    expect(compileSubcommandsMap.length).toBe(1);
  });
  it('should run on the one test', () => {
    const map = compileSubcommandsMap(testSubcommands);
    expect(Object.keys(map)).toEqual([
      'test1',
      'test2',
      'test3',
      'test4',
      'test5:test6',
    ]);
    expect(map.test1).toEqual(Test1);
    expect(map.test2).toEqual(Test2);
    expect(map.test3).toEqual(Test2);
    expect(map.test4).toEqual(Test3);
    expect(map['test5:test6']).toEqual(Test3);
  });
});
