import {
  isObservable,
} from '@sabinmarcu/observable';
import { config } from './config';
import { generateComplexTests } from './config.map.spec.partial';
import { generateSimpleTests } from './config.list.spec.partial';

describe('config', () => {
  it('should be a function', () => {
    expect(config).toBeInstanceOf(Function);
  });

  it('should have no parameters (rest)', () => {
    expect(config.length).toBe(0);
  });

  it('should return an observable', () => {
    const result = config({});
    expect(isObservable(result)).toBe(true);
  });

  // Previous tests
  generateComplexTests(config);
  generateSimpleTests(config);
});
