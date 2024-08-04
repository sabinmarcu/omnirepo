import {
  isObservable,
} from '@sabinmarcu/observable';
import {
  complexConfig,
  projectMapInput,
  projectMapInputItem,
} from './config.map';
import { generateComplexTests } from './config.map.spec.partial';

describe('projectMapInputItem', () => {
  it('should be a function', () => {
    expect(projectMapInputItem).toBeInstanceOf(Function);
  });

  it('should have two parameters', () => {
    expect(projectMapInputItem.length).toBe(2);
  });

  it('should return an observable', () => {
    const result = projectMapInputItem({ something: 'awesome' }, 'something');
    expect(isObservable(result)).toBe(true);
  });

  it('should return the correct structure', () => {
    const result = projectMapInputItem({ something: 'awesome' }, 'something');
    expect(result.value).toEqual({ something: 'awesome' });
  });
});

describe('projectMapInput', () => {
  it('should be a function', () => {
    expect(projectMapInput).toBeInstanceOf(Function);
  });

  it('should have one parameter', () => {
    expect(projectMapInput.length).toBe(1);
  });

  it('should return an array of observables', () => {
    const result = projectMapInput({
      something: 'awesome',
      some: 'thing',
    });
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(result.every((item) => isObservable(item))).toBe(true);
  });

  it('should return the correct array of observables', () => {
    const input = {
      something: 'awesome',
      some: 'thing',
    };
    const result = projectMapInput({
      something: 'awesome',
      some: 'thing',
    });
    for (const item of result) {
      const { value } = item;
      const keys = Object.keys(value!);
      // has one key only
      expect(keys.length).toBe(1);
      const [key] = keys;
      // the value associated with the key is the same as the input
      expect(value![key as keyof typeof value]).toEqual(input[key as keyof typeof input]);
    }
  });
});

describe('complexConfig', () => {
  it('should be a function', () => {
    expect(complexConfig).toBeInstanceOf(Function);
  });

  it('should have one parameter', () => {
    expect(complexConfig.length).toBe(1);
  });

  it('should return an observable', () => {
    const result = complexConfig({});
    expect(isObservable(result)).toBe(true);
  });

  // Generate tests (to be reused with config)
  generateComplexTests(complexConfig);
});
