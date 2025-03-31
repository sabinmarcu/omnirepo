import { mock } from './mock.js';
import {
  isObservable,
  observable,
} from './observable.js';
import type {
  Observable,
  ObserverController,
  PipedObservable,
} from './types.js';

// eslint-disable-next-line unicorn/empty-brace-spaces
const noop = () => { };

describe('observable', () => {
  beforeEach(() => {
    // expect(mock.subscriptionPool.size).toBe(0);
  });

  it('should be a function', () => {
    expect(typeof observable).toBe('function');
  });
  it('should have one argument', () => {
    expect(observable.length).toBe(2);
  });

  describe('return shape', () => {
    it('should return an object', () => {
      const obs = observable(noop);
      expect(typeof obs).toBe('object');
    });
    it('should have the proper keys', () => {
      const obs = observable(noop);
      expect(Object.keys(obs)).toEqual(mock.keys);
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

  describe('subscription pool (mocking)', () => {
    describe('subscription pool', () => {
      let nextFunction: ObserverController<number>['next'];
      it('should be empty by default', () => {
        expect(mock.subscriptionPool.value?.size).toBe(0);
      });
      it('should increase when subscribing', () => {
        const obs = observable(noop);
        expect(mock.subscriptionPool.value?.size).toBe(0);
        const sub = obs.subscribe({} as any);
        expect(mock.subscriptionPool.value?.size).toBe(1);
        sub.unsubscribe();
        expect(mock.subscriptionPool.value?.size).toBe(0);
      });
      it('should empty with the correct method', () => {
        const obs = observable(({ next }) => { nextFunction = next; });
        expect(mock.subscriptionPool.value?.size).toBe(0);
        const next = jest.fn();
        obs.subscribe({ next });
        expect(next).toHaveBeenCalledWith(undefined);
        expect(next).toHaveBeenCalledTimes(1);
        nextFunction(42);
        expect(next).toHaveBeenCalledWith(42);
        expect(next).toHaveBeenCalledTimes(2);
        expect(mock.subscriptionPool.value?.size).toBe(1);
        mock.emptySubscriptionPool();
        expect(mock.subscriptionPool.value?.size).toBe(0);
        nextFunction(69);
        expect(next).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('number observable', () => {
    let nextFunction: ObserverController<number>['next'];
    let completeFunction: ObserverController<number>['complete'];
    let errorFunction: ObserverController<number>['error'];
    let obs: Observable<number>;
    const initialValue = 42;

    beforeEach(() => {
      obs = observable(({
        next, complete, error,
      }) => {
        nextFunction = next;
        completeFunction = complete;
        errorFunction = error;
      }, initialValue);
    });

    it('observable should have the correct value', () => {
      expect(obs.value).toEqual(initialValue);
    });

    it('should call next when next is called', () => {
      const next = jest.fn();
      obs.subscribe({ next });
      expect(next).toHaveBeenCalledWith(42);
      nextFunction(1);
      expect(next).toHaveBeenCalledWith(1);
    });

    it('should call complete when complete is called', () => {
      const complete = jest.fn();
      obs.subscribe({ complete });
      expect(complete).not.toHaveBeenCalled();
      completeFunction();
      expect(complete).toHaveBeenCalled();
    });

    it('should call error when error is called', () => {
      const error = jest.fn();
      obs.subscribe({ error });
      expect(error).not.toHaveBeenCalled();
      errorFunction(new Error('test'));
      expect(error).toHaveBeenCalledWith(new Error('test'));
    });

    it('should stop propagation after complete', () => {
      const next = jest.fn();
      const complete = jest.fn();
      obs.subscribe({
        complete,
        next,
      });
      expect(complete).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      completeFunction();
      expect(complete).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
      nextFunction(1);
      expect(complete).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe('observable().filter', () => {
    let obs: Observable<number>;
    let nextFunction: ObserverController<number>['next'];
    const initialValue = 42;

    beforeAll(() => {
      obs = observable(({ next }) => {
        nextFunction = next;
      }, initialValue);
    });

    beforeEach(() => {
      nextFunction(initialValue);
    });

    it('should be a function', () => {
      expect(typeof obs.filter).toBe('function');
    });

    it('should have one argument', () => {
      expect(obs.filter.length).toBe(1);
    });

    describe('filtering by even', () => {
      let filteredObs: PipedObservable<number>;
      beforeEach(() => {
        filteredObs = obs.filter((v) => v! % 2 === 0);
      });

      it('should initially have the correct value', () => {
        expect(filteredObs.value).toBe(initialValue);
      });

      it('should allow the next even value to be registered', () => {
        const nextValue = 420;
        expect(filteredObs.value).toBe(initialValue);
        nextFunction(nextValue);
        expect(filteredObs.value).toBe(nextValue);
      });

      it('should not allow the next odd value to be registered', () => {
        const nextValue = 69;
        expect(filteredObs.value).toBe(initialValue);
        nextFunction(nextValue);
        expect(filteredObs.value).toBe(initialValue);
      });
    });
  });

  describe('observable().map', () => {
    let obs: Observable<number>;
    let nextFunction: ObserverController<number>['next'];
    const initialValue = 42;

    beforeAll(() => {
      obs = observable(({ next }) => {
        nextFunction = next;
      }, initialValue);
    });

    beforeEach(() => {
      nextFunction(initialValue);
    });

    it('should be a function', () => {
      expect(typeof obs.filter).toBe('function');
    });

    it('should have one argument', () => {
      expect(obs.filter.length).toBe(1);
    });

    it('should double the input', () => {
      const mappedObs = obs.map((v) => v! * 2);
      expect(mappedObs.value).toBe(initialValue * 2);
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

  describe('observable.project', () => {
    it('should be a function', () => {
      expect(typeof observable.project).toBe('function');
    });
    it('should have no arguments (it\'s all rest)', () => {
      expect(observable.project.length).toBe(0);
    });
    it('should return an observable', () => {
      const obs = observable(noop);
      const projection = observable.project(obs, () => {});
      expect(isObservable(projection)).toBe(true);
    });
    it('should project basic map', () => {
      const obs = observable.from(42);
      const projection = observable.project(obs, (v) => v * 2);
      expect(projection.value).toBe(84);
    });
    it('should project basic addition', () => {
      const a = observable.from(5);
      const b = observable.from(7);
      const projection = observable.project(a, b, (x, y) => x + y);
      expect(projection.value).toBe(12);
    });
    it('should project a mix of numbers and strings', () => {
      const valueObs = observable.from(5);
      const prefixObs = observable.from('The value is ');
      const projection = observable.project(
        valueObs,
        prefixObs,
        (value, prefix) => prefix + value,
      );
      expect(projection.value).toBe('The value is 5');
    });
    it('should react to observable updates', () => {
      let nextFunction: ObserverController<number>['next'];
      const initialValue = 42;
      const obs = observable<number>(({ next }) => {
        nextFunction = next;
      }, initialValue);
      const mappedObs = observable.project(obs, (v) => v * 2);
      expect(mappedObs.value).toBe(initialValue * 2);
      // @ts-ignore
      nextFunction(69);
      expect(mappedObs.value).toBe(69 * 2);
    });
  });

  describe('complex operations', () => {
    let obs: Observable<number>;
    let nextFunction: ObserverController<number>['next'];
    const initialValue = 69;

    beforeAll(() => {
      obs = observable(({ next }) => {
        nextFunction = next;
      }, initialValue);
    });

    beforeEach(() => {
      nextFunction(initialValue);
    });

    it('should filter by even and then map to double', () => {
      const spy = jest.fn();
      const sub = obs.filter((v) => v! % 2 === 1).map((v) => v! * 2);
      sub.subscribe({ next: spy });
      expect(sub.value).toEqual(initialValue * 2);
      expect(spy).toHaveBeenCalledTimes(1);
      nextFunction(42);
      expect(sub.value).toEqual(initialValue * 2);
      expect(spy).toHaveBeenCalledTimes(1);
      nextFunction(43);
      expect(sub.value).toEqual(43 * 2);
      expect(spy).toHaveBeenCalledTimes(2);
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
    {
      description: 'undefined',
      given: undefined,
      expected: false,
    },

    {
      description: 'null',

      given: null,
      expected: false,
    },
    {
      description: 'empty object',
      given: {},
      expected: false,
    },
    {
      description: 'observable from factory',
      given: observable(noop),
      expected: true,
    },
    {
      description: 'fake object that matches shape',
      given: {
        subscribe: noop,
        filter: noop,
        map: noop,
        value: 1,
      },
      expected: true,
    },
  ])('isObservable($description)', ({
    given, expected,
  }) => {
    expect(isObservable(given)).toBe(expected);
  });
});
