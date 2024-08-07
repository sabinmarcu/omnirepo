import {
  isObservable,
} from '@sabinmarcu/observable';
import {
  filterRawDebugRulesBy,
  debugString,
  debugRules,
} from './config.js';
import { env as environment } from './environment.js';

describe('debugSubject', () => {
  it('should be a subject', () => {
    expect(debugString.subscribe).toBeDefined();
    expect(debugString.next).toBeDefined();
  });
});

describe('filterRawDebugRulesBy', () => {
  it('should filter raw debug rules by enabled', () => {
    const input = [
      {
        enabled: true,
        name: 'foo',
      },
      {
        enabled: false,
        name: 'bar',
      },
      {
        enabled: true,
        name: 'baz',
      },
    ];
    const isEnabled = true;
    const expectedOutput = [
      {
        enabled: true,
        name: 'foo',
      },
      {
        enabled: true,
        name: 'baz',
      },
    ];
    expect(filterRawDebugRulesBy(isEnabled)(input as any)).toEqual(expectedOutput);
  });
});

describe('debugString', () => {
  it('should be an observable', () => {
    expect(isObservable(debugString)).toBe(true);
  });

  it('should emit a string when a new value is pushed to the subject', () => {
    const expectedOutput = 'test';
    const next = jest.fn();
    debugString.subscribe({ next });

    expect(debugString.value).toBe(environment.DEBUG);
    expect(next).toHaveBeenCalledWith(environment.DEBUG);

    debugString.next(expectedOutput);

    expect(debugString.value).toBe(expectedOutput);
    expect(next).toHaveBeenLastCalledWith(expectedOutput);
  });
});

describe('debugString', () => {
  it('should be a string', () => {
    expect(typeof debugString).toBe('object');
  });
  it('should be an observable', () => {
    expect(isObservable(debugString)).toBe(true);
  });
});

describe('debugRules', () => {
  it('should be an observable', () => {
    expect(isObservable(debugRules)).toBe(true);
  });

  it('should emit an array of raw debug rules when a new value is pushed to the subject', () => {
    const expectedOutput = [
      {
        enabled: true,
        path: 'foo',
        namespace: undefined,
        channel: undefined,
      },
      {
        enabled: false,
        path: 'bar',
        namespace: undefined,
        channel: undefined,
      },
      {
        enabled: true,
        path: 'baz',
        namespace: undefined,
        channel: undefined,
      },
    ];
    const next = jest.fn();
    debugRules.subscribe({ next });

    expect(debugString.value).toBe(environment.DEBUG);
    expect(next).toHaveBeenCalledWith(undefined);

    debugString.next('foo,-bar,baz');

    expect(debugString.value).toBe('foo,-bar,baz');
    expect(debugRules.value).toEqual(expectedOutput);
    expect(next).toHaveBeenLastCalledWith(expectedOutput);
  });
});
