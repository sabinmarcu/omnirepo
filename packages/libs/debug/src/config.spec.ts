import {
  isObservable,
} from '@sabinmarcu/observable';
import {
  debugSubject,
  filterRawDebugRulesBy,
  mapRawDebugRuleToDebugRule,
  debugString,
  rawRules,
  enabledRules,
  disabledRules,
} from './config';
import { env as environment } from './environment';

describe('debugSubject', () => {
  it('should be a subject', () => {
    expect(debugSubject.subscribe).toBeDefined();
    expect(debugSubject.next).toBeDefined();
  });
});

describe('filterRawDebugRulesBy', () => {
  it('should filter raw debug rules by enabled', () => {
    const input = [
      { enabled: true, name: 'foo' },
      { enabled: false, name: 'bar' },
      { enabled: true, name: 'baz' },
    ];
    const isEnabled = true;
    const expectedOutput = [
      { enabled: true, name: 'foo' },
      { enabled: true, name: 'baz' },
    ];
    expect(filterRawDebugRulesBy(isEnabled)(input as any)).toEqual(expectedOutput);
  });
});

describe('mapRawDebugRuleToDebugRule', () => {
  it('should map raw debug rules to debug rules', () => {
    const input = [
      { enabled: true, name: 'foo' },
      { enabled: true, name: 'bar' },
      { enabled: true, name: 'baz' },
    ];
    const expectedOutput = [
      { name: 'foo' },
      { name: 'bar' },
      { name: 'baz' },
    ];
    expect(mapRawDebugRuleToDebugRule(input as any)).toEqual(expectedOutput);
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

    expect(debugSubject.value).toBe(undefined);
    expect(debugString.value).toBe(environment.DEBUG);
    expect(next).toHaveBeenCalledWith(environment.DEBUG);

    debugSubject.next(expectedOutput);

    expect(debugSubject.value).toBe(expectedOutput);
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

describe('rawRules', () => {
  it('should be an observable', () => {
    expect(isObservable(rawRules)).toBe(true);
  });

  it('should emit an array of raw debug rules when a new value is pushed to the subject', () => {
    const expectedOutput = [
      {
        enabled: true,
        path: 'foo',
        namespace: '',
        channel: '',
      },
      {
        enabled: false,
        path: 'bar',
        namespace: '',
        channel: '',
      },
      {
        enabled: true,
        path: 'baz',
        namespace: '',
        channel: '',
      },
    ];
    const next = jest.fn();
    rawRules.subscribe({ next });

    expect(debugSubject.value).toBe(undefined);
    expect(debugString.value).toBe(environment.DEBUG);
    expect(next).toHaveBeenCalledWith(undefined);

    debugSubject.next('foo,-bar,baz');

    expect(debugSubject.value).toBe('foo,-bar,baz');
    expect(rawRules.value).toEqual(expectedOutput);
    expect(next).toHaveBeenLastCalledWith(expectedOutput);
  });
});

describe('enabledRules', () => {
  it('should be an observable', () => {
    expect(isObservable(enabledRules)).toBe(true);
  });

  it('should emit an array of enabled debug rules when a new value is pushed to the subject', () => {
    const expectedOutput = [
      {
        path: 'foo',
        namespace: '',
        channel: '',
      },
      {
        path: 'baz',
        namespace: '',
        channel: '',
      },
    ];
    const next = jest.fn();
    enabledRules.subscribe({ next });

    expect(debugSubject.value).toBe(undefined);
    expect(debugString.value).toBe(environment.DEBUG);
    expect(next).toHaveBeenCalledWith(undefined);

    debugSubject.next('foo,-bar,baz');

    expect(debugSubject.value).toBe('foo,-bar,baz');
    expect(enabledRules.value).toEqual(expectedOutput);
    expect(next).toHaveBeenLastCalledWith(expectedOutput);
  });
});

describe('disabledRules', () => {
  it('should be an observable', () => {
    expect(isObservable(disabledRules)).toBe(true);
  });

  it('should emit an array of disabled debug rules when a new value is pushed to the subject', () => {
    const expectedOutput = [
      {
        path: 'bar',
        namespace: '',
        channel: '',
      },
    ];
    const next = jest.fn();
    disabledRules.subscribe({ next });

    expect(debugSubject.value).toBe(undefined);
    expect(debugString.value).toBe(environment.DEBUG);
    expect(next).toHaveBeenCalledWith(undefined);

    debugSubject.next('foo,-bar,baz');

    expect(debugSubject.value).toBe('foo,-bar,baz');
    expect(disabledRules.value).toEqual(expectedOutput);
    expect(next).toHaveBeenLastCalledWith(expectedOutput);
  });
});
