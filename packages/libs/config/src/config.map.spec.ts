import {
  isObservable,
} from '@sabinmarcu/observable';
import { complexConfig } from './config.map';
import { generateComplexTests } from './config.map.spec.partial';

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
