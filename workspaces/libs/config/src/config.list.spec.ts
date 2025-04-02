import {
  describe,
  it,
  expect,
} from 'vitest';
import {
  isObservable,
  observable,
  subject,
} from '@sabinmarcu/observable';
import {
  simpleConfig,
  projectListInput,
} from './config.list.js';
import { generateSimpleTests } from './config.list.spec.partial.js';

describe('projectListInput', () => {
  it('should be a function', () => {
    expect(projectListInput).toBeInstanceOf(Function);
  });

  it('should have no parameters (rest)', () => {
    expect(projectListInput.length).toBe(0);
  });

  it('should return an array of observables', () => {
    const result = projectListInput(1, 2, observable.from(5), subject(32));
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(4);
    expect(result.every((item) => isObservable(item))).toBe(true);
  });
});

describe('simpleConfig', () => {
  it('should be a function', () => {
    expect(simpleConfig).toBeInstanceOf(Function);
  });

  it('should have no parameters (rest)', () => {
    expect(simpleConfig.length).toBe(0);
  });

  it('should return an observable', () => {
    const result = simpleConfig({});
    expect(isObservable(result)).toBe(true);
  });

  // Generate tests (to be reused with config)
  generateSimpleTests(simpleConfig);
});
