import { basicFormatter } from './basic';

describe('basicFormatter', () => {
  const formatterFunction = basicFormatter(undefined as any);
  it('should be a function', () => {
    expect(typeof basicFormatter).toBe('function');
    expect(typeof formatterFunction).toBe('function');
  });

  it('should take one argument (rest param after)', () => {
    expect(formatterFunction.length).toBe(1);
  });

  it('should return an array with the message', () => {
    const message = 'Hello, world!';
    const result = formatterFunction(undefined as any, message);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([message]);
  });
});
