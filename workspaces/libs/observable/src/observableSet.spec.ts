import { observableSet } from './observableSet';

describe('observableSet', () => {
  it('should emit a new value when a new item is added', () => {
    const set = observableSet(new Set<number>());
    const subscriber = jest.fn();
    set.subscribe({ next: subscriber });
    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledWith(new Set());

    set.add(1);
    expect(subscriber).toHaveBeenCalledTimes(2);
    expect(subscriber).toHaveBeenCalledWith(new Set([1]));
  });

  it('should emit a new value when an item is deleted', () => {
    const set = observableSet(new Set<number>([
      1,
      2,
      3,
    ]));
    const subscriber = jest.fn();
    set.subscribe({ next: subscriber });
    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledWith(new Set([
      1,
      2,
      3,
    ]));

    set.delete(2);
    expect(subscriber).toHaveBeenCalledTimes(2);
    expect(subscriber).toHaveBeenCalledWith(new Set([
      1,
      3,
    ]));
  });

  it('should emit a new value when all items are cleared', () => {
    const set = observableSet(new Set<number>([
      1,
      2,
      3,
    ]));
    const subscriber = jest.fn();
    set.subscribe({ next: subscriber });
    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledWith(new Set([
      1,
      2,
      3,
    ]));

    set.clear();
    expect(subscriber).toHaveBeenCalledTimes(2);
    expect(subscriber).toHaveBeenCalledWith(new Set());
  });

  it('should emit a new value when has is called', () => {
    const set = observableSet(new Set<number>([
      1,
      2,
      3,
    ]));
    const subscriber = jest.fn();
    set.subscribe({ next: subscriber });
    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledWith(new Set([
      1,
      2,
      3,
    ]));

    set.has(2);
    expect(subscriber).toHaveBeenCalledTimes(1);

    set.has(4);
    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledWith(new Set([
      1,
      2,
      3,
    ]));
  });
});
