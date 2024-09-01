import { stringCase } from './converter.js';
import { stringCases } from './constants.js';

import fixtures from './__fixtures__/index.js';

describe('case converter', () => {
  it('should be a function', () => {
    expect(stringCase).toBeInstanceOf(Function);
  });
  it('should have two parameters', () => {
    expect(stringCase).toHaveLength(2);
  });
  describe('manual test', () => {
    const source = 'hello-world';
    const sourceCase = 'kebab';
    const proxy = stringCase(source, sourceCase);
    it('should return a String', () => {
      expect(proxy).toBeInstanceOf(String);
    });
    it('should have all cases as variables', () => {
      for (const target of stringCases) {
        expect(proxy[target]).toBeInstanceOf(String);
      }
    });
    it('should be the same as itself', () => {
      expect(proxy.raw).toEqual(source);
    });
    it('should resolve kebab to pascal', () => {
      const { pascal } = proxy;
      expect(pascal.raw).toBe('HelloWorld');
    });
    it.only('should loop from kebab to pascal to snake and camel', () => {
      const { pascal } = proxy;
      expect(pascal.raw).toBe('HelloWorld');
      const { snake } = pascal;
      expect(snake.raw).toBe('hello_world');
      const { camel } = snake;
      expect(camel.raw).toBe('helloWorld');
    });
  });
  describe('automatic tests', () => {
    describe.each(fixtures)('test case: $name', (fixture) => {
      describe.each(stringCases)('from: %s', (sourceCase) => {
        const input = stringCase(fixture[sourceCase], sourceCase);
        it.each(stringCases)('to: %s', (targetCase) => {
          const output = fixture[targetCase];
          expect(input.raw).toEqual(output);
        });
      });
    });
  });
});
