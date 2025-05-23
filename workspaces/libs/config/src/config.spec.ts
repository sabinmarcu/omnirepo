import {
  describe,
  it,
  expect,
} from 'vitest';
import {
  isObservable,
} from '@sabinmarcu/observable';
import { config } from './config.js';
import { generateComplexTests } from './config.map.spec.partial.js';
import { generateSimpleTests } from './config.list.spec.partial.js';

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
