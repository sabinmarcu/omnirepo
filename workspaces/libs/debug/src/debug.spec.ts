import {
  describe,
  it,
  expect,
} from 'vitest';
import { subject } from '@sabinmarcu/observable';
import {
  debugDefinitionFromInput,
  debugDefinitionFromString,
  getOverrideForSubject,
} from './debug.js';

describe('debugDefinitionFromString', () => {
  it('should parse a valid debug string fragment', () => {
    const input = 'my-app:server';
    const expected = {
      namespace: 'my-app',
      path: 'server',
      channel: 'debug',
    };
    expect(debugDefinitionFromString(input)).toEqual(expected);
  });

  it('should throw an error for an invalid debug string fragment', () => {
    const input = 'my-app:server:extra';
    expect(() => debugDefinitionFromString(input)).toThrow();
  });

  it('should parse a debug string fragment with a namespace containing hyphens', () => {
    const input = 'my-app-with-hyphens:server';
    const expected = {
      namespace: 'my-app-with-hyphens',
      path: 'server',
      channel: 'debug',
    };
    expect(debugDefinitionFromString(input)).toEqual(expected);
  });

  it('should parse a debug string fragment with a path containing hyphens', () => {
    const input = 'my-app:server-with-hyphens';
    const expected = {
      namespace: 'my-app',
      path: 'server-with-hyphens',
      channel: 'debug',
    };
    expect(debugDefinitionFromString(input)).toEqual(expected);
  });
});

describe('debugDefinitionFromInput', () => {
  it('should return the same debug definition when input is already a debug definition', () => {
    const input = {
      namespace: 'my-app',
      path: 'server',
      channel: 'debug',
    } as const;
    const result = debugDefinitionFromInput(input);
    expect(result).toEqual(input);
  });

  it('should parse a valid debug string fragment when input is a string', () => {
    const input = 'my-app:server';
    const expected = {
      namespace: 'my-app',
      path: 'server',
      channel: 'debug',
    };
    const result = debugDefinitionFromInput(input);
    expect(result).toEqual(expected);
  });

  it('should throw an error for an invalid debug string fragment when input is a string', () => {
    const input = 'my-app:server:extra';
    expect(() => debugDefinitionFromInput(input)).toThrow();
  });
});

describe('getOverrideForSubject', () => {
  it('should return the default subject when optionalInput is not provided', () => {
    const defaultSubject = subject('base');
    const [result] = getOverrideForSubject(defaultSubject);
    expect(result.value).toBe(defaultSubject.value);
  });

  it('should return a new subject with the optionalInput when it is provided', () => {
    const defaultSubject = subject('base');
    const initialValue = 'initial';
    const [result] = getOverrideForSubject(defaultSubject, initialValue);
    expect(result.value).toBe(initialValue);
  });

  it('should return a subject that reacts properly to change', () => {
    const defaultSubject = subject('base');
    const initialValue = 'initial';
    const nextValue = 'next';
    const [
      result,
      next,
    ] = getOverrideForSubject(defaultSubject, initialValue);
    expect(result.value).toBe(initialValue);
    next(nextValue);
    expect(result.value).toBe(nextValue);
  });

  it('should return a subject that reverts to base value when subject is set to undefined', () => {
    const defaultSubject = subject('base');
    const initialValue = 'initial';
    const [
      result,
      next,
    ] = getOverrideForSubject(defaultSubject, initialValue);
    expect(result.value).toBe(initialValue);
    next(undefined);
    expect(result.value).toBe(defaultSubject.value);
  });
});
