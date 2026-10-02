import {
  describe,
  expect,
  it,
} from 'vitest';
import { breakpointGenerator } from './breakpoints.js';

describe('breakpointGenerator', () => {
  it('creates every inclusive, exclusive, and forward range query', () => {
    const entries = [
      ['small', 320],
      ['medium', 768],
      ['large', 1024],
    ] as const;

    const descriptor = breakpointGenerator(entries);

    expect(descriptor).toEqual({
      kind: 'static',
      output: {
        lt: {
          small: '(width < 320px)',
          medium: '(width < 768px)',
          large: '(width < 1024px)',
        },
        gt: {
          small: '(width > 320px)',
          medium: '(width > 768px)',
          large: '(width > 1024px)',
        },
        lte: {
          small: '(max-width: 320px)',
          medium: '(max-width: 768px)',
          large: '(max-width: 1024px)',
        },
        gte: {
          small: '(min-width: 320px)',
          medium: '(min-width: 768px)',
          large: '(min-width: 1024px)',
        },
        between: {
          'small-medium': '(320px < width < 768px)',
          'small-large': '(320px < width < 1024px)',
          'medium-large': '(768px < width < 1024px)',
        },
      },
    });
  });

  it('accepts a zero threshold and produces no ranges for one breakpoint', () => {
    expect(breakpointGenerator([['base', 0]]).output).toEqual({
      lt: { base: '(width < 0px)' },
      gt: { base: '(width > 0px)' },
      lte: { base: '(max-width: 0px)' },
      gte: { base: '(min-width: 0px)' },
      between: {},
    });
  });

  it('does not mutate caller-owned entries and owns an immutable output', () => {
    const entries: [string, number][] = [['small', 320], ['large', 1024]];
    const descriptor = breakpointGenerator(entries);

    expect(entries).toEqual([['small', 320], ['large', 1024]]);
    entries[0]![1] = 500;
    Reflect.set(descriptor.output.lt, 'small', '(width < 500px)');
    expect(descriptor.output.lt.small).toBe('(width < 320px)');
  });

  it('preserves prototype-like names and rejects ambiguous range names', () => {
    const output = breakpointGenerator([['__proto__', 320]]).output.lt;
    expect(Reflect.getOwnPropertyDescriptor(output, '__proto__')?.value).toBe('(width < 320px)');
    expect(() => breakpointGenerator([
      ['a-b', 320], ['c', 600], ['a', 700], ['b-c', 900],
    ])).toThrow(TypeError);
  });

  it.each([
    { entries: [['', 320]] },
    { entries: [['small', 320], ['small', 768]] },
    { entries: [['small', -1]] },
    { entries: [['small', Infinity]] },
    { entries: [['small', NaN]] },
    { entries: [['small', 768], ['large', 768]] },
    { entries: [['small', 768], ['large', 320]] },
  ] as const)('rejects invalid breakpoint entries: $entries', ({ entries }) => {
    expect(() => breakpointGenerator(entries)).toThrow(TypeError);
  });
});
