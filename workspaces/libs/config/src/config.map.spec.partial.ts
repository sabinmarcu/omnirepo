import { subject } from '@sabinmarcu/observable';
import { complexConfig } from './config.map';

export const generateComplexTests = (config = complexConfig) => {
  it('should return an observable with the correct value', () => {
    const expectedValue = { foo: 'bar' };
    const result = config(expectedValue);
    expect(result.value).toEqual(expectedValue);
    const next = jest.fn();
    result.subscribe({ next });
    expect(next).toHaveBeenCalledWith(expectedValue);
  });

  it('should properly react to subject changes', () => {
    const subject1 = subject('awesome');
    const subject2 = subject(21);
    const result = config({
      subject1,
      subject2,
    });
    expect(result.value).toEqual({
      subject1: 'awesome',
      subject2: 21,
    });
    const next = jest.fn();
    result.subscribe({ next });
    expect(next).toHaveBeenLastCalledWith({
      subject1: 'awesome',
      subject2: 21,
    });
    subject1.next('amazing');
    expect(result.value).toEqual({
      subject1: 'amazing',
      subject2: 21,
    });
    expect(next).toHaveBeenLastCalledWith({
      subject1: 'amazing',
      subject2: 21,
    });
    subject2.next(42);
    expect(result.value).toEqual({
      subject1: 'amazing',
      subject2: 42,
    });
    expect(next).toHaveBeenLastCalledWith({
      subject1: 'amazing',
      subject2: 42,
    });
  });

  it('should properly react to nested config changes', () => {
    const subject1 = subject('awesome');
    const subject2 = subject(21);
    const result = config({
      subject1,
      nested: config({ subject2 }),
    });
    expect(result.value).toEqual({
      subject1: 'awesome',
      nested: { subject2: 21 },
    });
    const next = jest.fn();
    result.subscribe({ next });
    expect(next).toHaveBeenLastCalledWith({
      subject1: 'awesome',
      nested: { subject2: 21 },
    });
    subject1.next('amazing');
    expect(result.value).toEqual({
      subject1: 'amazing',
      nested: { subject2: 21 },
    });
    expect(next).toHaveBeenLastCalledWith({
      subject1: 'amazing',
      nested: { subject2: 21 },
    });
    subject2.next(42);
    expect(result.value).toEqual({
      subject1: 'amazing',
      nested: { subject2: 42 },
    });
    expect(next).toHaveBeenLastCalledWith({
      subject1: 'amazing',
      nested: { subject2: 42 },
    });
  });
};
