import {
  describe,
  it,
  expect,
  vi,
} from 'vitest';
import { mock } from './mock.js';
import {
  isObservable,
} from './observable.js';
import { subject } from './subject.js';

describe('subject', () => {
  it('should be a function', () => {
    expect(typeof subject).toBe('function');
  });
  it('should have one argument', () => {
    expect(subject.length).toBe(1);
  });
  it('should return an observable', () => {
    expect(isObservable(subject())).toBe(true);
  });
  it('should update value when changed', () => {
    const initialValue = 42;
    const subj = subject(initialValue);
    expect(subj.value).toBe(initialValue);
    subj.next(initialValue * 2);
    expect(subj.value).toBe(initialValue * 2);
  });
  it('should respond to subcribers value when changed', () => {
    const initialValue = 42;
    const subj = subject(initialValue);
    const next = vi.fn();
    const sub = subj.subscribe({ next });
    expect(subj.value).toBe(initialValue);
    expect(next).toHaveBeenCalledWith(initialValue);
    expect(next).toHaveBeenCalledTimes(1);
    subj.next(initialValue * 2);
    expect(subj.value).toBe(initialValue * 2);
    expect(next).toHaveBeenCalledWith(initialValue * 2);
    expect(next).toHaveBeenCalledTimes(2);
    sub.unsubscribe();
  });
  it('should map correctly to double value', () => {
    const initialValue = 42;
    const subj = subject(initialValue);
    const obs = subj.map((v) => v! * 2);
    expect(subj.value).toBe(initialValue);
    expect(obs.value).toBe(initialValue * 2);
  });

  describe('subscription pool (mocking)', () => {
    describe('subscription pool', () => {
      it('should be empty by default', () => {
        expect(mock.subscriptionPool.value?.size).toBe(0);
      });
      it('should increase when subscribing', () => {
        const obs = subject();
        expect(mock.subscriptionPool.value?.size).toBe(0);
        const sub = obs.subscribe({} as any);
        expect(mock.subscriptionPool.value?.size).toBe(1);
        sub.unsubscribe();
        expect(mock.subscriptionPool.value?.size).toBe(0);
      });
      it('should empty with the correct method', () => {
        const obs = subject();
        expect(mock.subscriptionPool.value?.size).toBe(0);
        const next = vi.fn();
        obs.subscribe({ next });
        expect(next).toHaveBeenCalledWith(undefined);
        expect(next).toHaveBeenCalledTimes(1);
        obs.next(42);
        expect(next).toHaveBeenCalledWith(42);
        expect(next).toHaveBeenCalledTimes(2);
        expect(mock.subscriptionPool.value?.size).toBe(1);
        mock.emptySubscriptionPool();
        expect(mock.subscriptionPool.value?.size).toBe(0);
        obs.next(69);
        expect(next).toHaveBeenCalledTimes(2);
      });
    });
  });
});
