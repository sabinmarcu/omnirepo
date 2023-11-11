import {
  isObservable,
  observable,
} from './observable';
import type {
  Observable,
  ObserverController,
  Subscription,
} from './types';

// eslint-disable-next-line unicorn/empty-brace-spaces
const noop = () => { };

describe('observable', () => {
  it('should be a function', () => {
    expect(typeof observable).toBe('function');
  });
  it('should have one argument', () => {
    expect(observable.length).toBe(1);
  });

  describe('return shape', () => {
    it('should return an object', () => {
      const obs = observable(noop);
      expect(typeof obs).toBe('object');
    });
    it('should have the proper keys', () => {
      const obs = observable(noop);
      expect(Object.keys(obs)).toEqual([
        'value',
        'subscribe',
      ]);
    });
    it('should have the correct value type', () => {
      const obs = observable(({ next }) => { next(1); });
      expect(typeof obs.value).toBe('number');
      expect(obs.value).toBe(1);
    });
    it('should have the correct subscribe type', () => {
      const obs = observable(noop);
      expect(typeof obs.subscribe).toBe('function');
      const subscription = obs.subscribe({} as any);
      expect(typeof subscription).toBe('object');
      expect(Object.keys(subscription)).toEqual(['unsubscribe']);
      expect(typeof subscription.unsubscribe).toBe('function');
    });
  });

  describe('number observable', () => {
    let nextFunction: ObserverController<number>['next'];
    let completeFunction: ObserverController<number>['complete'];
    let errorFunction: ObserverController<number>['error'];
    let obs: Observable<number>;
    let subscription: Subscription | undefined;
    const initialValue = 42;

    beforeAll(() => {
      obs = observable(({ next, complete, error }) => {
        nextFunction = next;
        completeFunction = complete;
        errorFunction = error;
      });
    });

    beforeEach(() => {
      nextFunction(initialValue);
    });

    afterEach(() => {
      subscription?.unsubscribe();
    });

    it('observable should have the correct value', () => {
      expect(obs.value).toEqual(initialValue);
    });

    it('should call next when next is called', () => {
      const next = jest.fn();
      subscription = obs.subscribe({ next });
      expect(next).toHaveBeenCalledWith(42);
      nextFunction(1);
      expect(next).toHaveBeenCalledWith(1);
    });

    it('should call complete when complete is called', () => {
      const complete = jest.fn();
      subscription = obs.subscribe({ complete });
      expect(complete).not.toHaveBeenCalled();
      completeFunction();
      expect(complete).toHaveBeenCalled();
    });

    it('should call error when error is called', () => {
      const error = jest.fn();
      subscription = obs.subscribe({ error });
      expect(error).not.toHaveBeenCalled();
      errorFunction(new Error('test'));
      expect(error).toHaveBeenCalledWith(new Error('test'));
    });
  });

  describe('observable.from', () => {
    it('should be a function', () => {
      expect(typeof observable.from).toBe('function');
    });
    it('should have one argument', () => {
      expect(observable.from.length).toBe(1);
    });
    it('should return an observable', () => {
      expect(isObservable(observable.from(1))).toBe(true);
    });
    it('should return the given value', () => {
      const value = 42;
      let returnedValue: number | undefined;
      expect(returnedValue).toBe(undefined);
      observable.from(value).subscribe({ next: (v) => { returnedValue = v; } });
      expect(returnedValue).toBe(value);
    });
  });
});

describe('isObservable', () => {
  it('should be a function', () => {
    expect(typeof isObservable).toBe('function');
  });
  it('should have one argument', () => {
    expect(isObservable.length).toBe(1);
  });
  it.each([
    { description: 'undefined', given: undefined, expected: false },
    // eslint-disable-next-line unicorn/no-null
    { description: 'null', given: null, expected: false },
    { description: 'empty object', given: {}, expected: false },
    { description: 'observable from factory', given: observable(noop), expected: true },
    {
      description: 'fake object that matches shape',
      given: {
        subscribe: noop,
        value: 1,
      },
      expected: true,
    },
  ])('isObservable($description)', ({ given, expected }) => {
    expect(isObservable(given)).toBe(expected);
  });
});
