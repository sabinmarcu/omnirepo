import {
  observableMap,
} from './observableMap';

describe('observableMap', () => {
  it('should create an observable map with the given source', () => {
    const source = new Map([
      [
        'a',
        1,
      ],
      [
        'b',
        2,
      ],
    ]);
    const map = observableMap(source);

    expect(map).toBeInstanceOf(Map);
    expect(map).toEqual(source);
  });

  it('should create an observable map with an empty source if none is provided', () => {
    const map = observableMap();

    expect(map).toBeInstanceOf(Map);
    expect(map.size).toBe(0);
  });

  it('should emit a new value to subscribers when a value is set', () => {
    const map = observableMap(new Map([
      [
        'a',
        1,
      ],
    ]));
    const subscriber = jest.fn();

    map.subscribe({ next: subscriber });
    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledWith(new Map([
      [
        'a',
        1,
      ],
    ]));
    map.set('b', 2);
    expect(subscriber).toHaveBeenCalledWith(new Map([
      [
        'a',
        1,
      ],
      [
        'b',
        2,
      ],
    ]));
  });

  it('should emit a new value to subscribers when a value is deleted', () => {
    const map = observableMap(new Map([
      [
        'a',
        1,
      ],
      [
        'b',
        2,
      ],
    ]));
    const subscriber = jest.fn();

    map.subscribe({ next: subscriber });
    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledWith(new Map([
      [
        'a',
        1,
      ],
      [
        'b',
        2,
      ],
    ]));
    map.delete('b');
    expect(subscriber).toHaveBeenCalledWith(new Map([
      [
        'a',
        1,
      ],
    ]));
  });

  it('should emit a new value to subscribers when the map is cleared', () => {
    const map = observableMap(new Map([
      [
        'a',
        1,
      ],
      [
        'b',
        2,
      ],
    ]));
    const subscriber = jest.fn();

    map.subscribe({ next: subscriber });
    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledWith(new Map([
      [
        'a',
        1,
      ],
      [
        'b',
        2,
      ],
    ]));
    map.clear();
    expect(subscriber).toHaveBeenCalledWith(new Map());
  });

  it('should return an iterator of key-value pairs for entries()', () => {
    const map = observableMap(new Map([
      [
        'a',
        1,
      ],
      [
        'b',
        2,
      ],
    ]));
    const entries = map.entries();

    expect(entries.next().value).toEqual([
      'a',
      1,
    ]);
    expect(entries.next().value).toEqual([
      'b',
      2,
    ]);
    expect(entries.next().done).toBe(true);
  });

  it('should return an iterator of keys for keys()', () => {
    const map = observableMap(new Map([
      [
        'a',
        1,
      ],
      [
        'b',
        2,
      ],
    ]));
    const keys = map.keys();

    expect(keys.next().value).toBe('a');
    expect(keys.next().value).toBe('b');
    expect(keys.next().done).toBe(true);
  });

  it('should return an iterator of values for values()', () => {
    const map = observableMap(new Map([
      [
        'a',
        1,
      ],
      [
        'b',
        2,
      ],
    ]));
    const values = map.values();

    expect(values.next().value).toBe(1);
    expect(values.next().value).toBe(2);
    expect(values.next().done).toBe(true);
  });

  it('should call the provided function for each key-value pair in forEach()', () => {
    const map = observableMap(new Map([
      [
        'a',
        1,
      ],
      [
        'b',
        2,
      ],
    ]));
    const callback = jest.fn();

    // eslint-disable-next-line unicorn/no-array-for-each
    map.forEach(callback);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith(1, 'a', map);
    expect(callback).toHaveBeenCalledWith(2, 'b', map);
  });
});
