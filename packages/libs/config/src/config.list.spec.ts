import {
  isObservable,
} from '@sabinmarcu/observable';
import { simpleConfig } from './config.list';
import { generateSimpleTests } from './config.list.spec.partial';

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
