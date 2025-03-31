import type { Observable } from '@sabinmarcu/observable';
import {
  observable,
  subject,
} from '@sabinmarcu/observable';
import { simpleConfig } from './config.list.js';

export const generateSimpleTests = (config = simpleConfig) => {
  it('should return an observable with the correct value', () => {
    const expectedValue = { foo: 'bar' };
    const result = config(expectedValue);
    expect(result.value).toEqual(expectedValue);
    const next = jest.fn();
    result.subscribe({ next });
    expect(next).toHaveBeenCalledWith(expectedValue);
  });

  it('should properly filter the correct value in reverse order', () => {
    const result = config(
      1,
      2,
      3,
      4,
      5,
      undefined,
      observable.from(undefined),
    ) as Observable<number>;
    expect(result.value).toEqual(5);
    const next = jest.fn();
    result.subscribe({ next });
    expect(next).toHaveBeenCalledWith(5);
  });

  it('should fallback to undefined if all values are undefined', () => {
    const result = config(
      undefined,
      observable.from(undefined),
    ) as Observable<number>;
    expect(result.value).toEqual(undefined);
    const next = jest.fn();
    result.subscribe({ next });
    expect(next).toHaveBeenCalledWith(undefined);
  });

  it('should properly react to subject changes (one value, one subject)', () => {
    const testSubject = subject<number>();
    const result = config(11, testSubject);

    expect(result.value).toEqual(11);
    expect(testSubject.value).toEqual(undefined);

    const next = jest.fn();
    result.subscribe({ next });
    expect(next).toHaveBeenLastCalledWith(11);

    testSubject.next(42);

    expect(result.value).toEqual(42);
    expect(next).toHaveBeenLastCalledWith(42);

    testSubject.next(undefined as any);

    expect(result.value).toEqual(11);
    expect(next).toHaveBeenLastCalledWith(11);
  });

  it('should properly react to subject changes (one value, two subjects)', () => {
    const subject1 = subject(35);
    const subject2 = subject(21);
    const result = config(11, subject1, subject2);
    expect(result.value).toEqual(21);
    const next = jest.fn();
    result.subscribe({ next });
    expect(next).toHaveBeenLastCalledWith(21);
    next.mockClear();
    subject2.next(undefined as any);
    expect(next).toHaveBeenLastCalledWith(35);
    subject2.next(42);
    expect(result.value).toEqual(42);
    expect(next).toHaveBeenLastCalledWith(42);
    subject1.next(undefined as any);
    subject2.next(undefined as any);
    expect(result.value).toEqual(11);
    expect(next).toHaveBeenLastCalledWith(11);
  });
};
