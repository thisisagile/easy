import '@thisisagile/easy-test';
import { Dev } from '../ref';
import { asString, isConstructor, tryTo } from '../../src';
import { mock } from '@thisisagile/easy-test';

describe('Try', () => {
  const devToId = (d: Dev): string => asString(d.id);

  const successes = [Dev.Sander, () => Dev.Jeroen, tryTo(Dev.Rob), tryTo(() => Dev.Jeroen), () => tryTo(() => tryTo(Dev.Rob))];
  const valids = [Dev.Sander, () => Dev.Jeroen, tryTo(() => Dev.Jeroen)];

  const devToError = (d: Dev): Dev => {
    throw new Error(`Dev ${d} goes wrong`);
  };

  const divByZero = (n = 0) => {
    throw new Error(`Divide ${n} by zero`);
  };

  const errors = [divByZero, tryTo(divByZero), tryTo(() => divByZero(3))];

  // toTry

  test.each(successes)('of success', s => {
    expect(tryTo(s)).toBeValid();
  });

  test.each(errors)('of error', s => {
    expect(tryTo(s)).not.toBeValid();
  });

  test('Dinges', () => {
    expect(isConstructor(() => 'Hello')).toBeFalsy();
  });

  // value

  test.each(successes)('value success', s => {
    expect(tryTo(s).value).toBeInstanceOf(Dev);
  });

  test.each(errors)('value error', s => {
    expect(() => tryTo(s).value).toThrow();
  });

  // map

  test.each(successes)('map success to success', s => {
    expect(tryTo(s).map(d => devToId(d))).toBeValid();
  });

  test.each(successes)('map success to success value is a string', s => {
    expect(typeof tryTo(s).map(d => devToId(d)).value).toBe('string');
  });

  test.each(successes)('map success to failure should fail', s => {
    expect(tryTo(s).map(d => devToError(d))).not.toBeValid();
  });

  test.each(errors)('map error', s => {
    expect(tryTo(s).map(e => e)).not.toBeValid();
  });

  // accept

  test.each(successes)('accept success to keep original value', s => {
    expect(tryTo(s).accept(d => devToId(d)).value).toBeInstanceOf(Dev);
  });

  test.each(successes)('accept failure to return failure', s => {
    expect(tryTo(s).accept(d => devToError(d))).not.toBeValid();
  });

  test.each(errors)('accept errors to remain failures', s => {
    expect(tryTo(s).accept(e => e)).not.toBeValid();
  });

  // recover

  test.each(successes)('recover success to keep original value', s => {
    expect(tryTo(s).recover(() => Dev.Wouter).value).not.toBe(Dev.Wouter);
  });

  test.each(successes)('recover from error to return valid', s => {
    expect(
      tryTo(s)
        .map(d => devToError(d))
        .recover(() => Dev.Wouter).value
    ).toBe(Dev.Wouter);
  });

  // recoverFrom

  class NotValidError extends Error {}

  const devToNotValidError = (d: Dev): Dev => {
    throw new NotValidError(`Dev ${d} goes wrong`);
  };
  test.each(successes)('recover from with success to keep original value', s => {
    expect(tryTo(s).recoverFrom(NotValidError, () => Dev.Wouter).value).not.toBe(Dev.Wouter);
  });

  test.each(successes)('recover from with different error to recover', s => {
    expect(
      tryTo(s)
        .map(d => devToError(d))
        .recoverFrom(NotValidError, () => Dev.Wouter)
        .recover(() => Dev.Sander).value
    ).toBe(Dev.Sander);
  });

  test.each(successes)('recover from with specific error to recover', s => {
    expect(
      tryTo(s)
        .map(d => devToNotValidError(d))
        .recoverFrom(NotValidError, () => Dev.Wouter)
        .recover(() => Dev.Sander).value
    ).toBe(Dev.Wouter);
  });

  // filter

  test.each(successes)('filter is successes is true returns original value', s => {
    expect(tryTo(s).filter(() => true).value).toBeInstanceOf(Dev);
  });

  test.each(successes)('filter on successes is false returns failure', s => {
    expect(tryTo(s).filter(() => false)).not.toBeValid();
  });

  test.each(errors)('filter on errors returns failure', s => {
    expect(tryTo(s).filter(() => true)).not.toBeValid();
  });

  const describedPredicate = (result: boolean) => {
    const predicate = (): boolean => result;
    predicate.toString = jest.fn(() => 'described');
    return predicate;
  };

  test('filter miss builds its error only when the error is read', () => {
    const predicate = describedPredicate(false);
    const t = tryTo(Dev.Sander).filter(predicate);
    expect(t).not.toBeValid();
    expect(t.orElse(Dev.Wouter)).toBe(Dev.Wouter);
    expect(predicate.toString).not.toHaveBeenCalled();
    expect(t.error.message).toBe('Applying filter(described) failed.');
    expect(t.error).toBe(t.error);
    expect(predicate.toString).toHaveBeenCalledTimes(1);
  });

  test('filter miss keeps its error through map, filter and tryTo', () => {
    const miss = tryTo(Dev.Sander).filter(describedPredicate(false));
    const mapped = tryTo(() => miss.map(devToId).filter(() => true));
    expect(mapped.error).toBe(miss.error);
    expect(() => mapped.value).toThrow('Applying filter(described) failed.');
  });

  test('filter with a throwing predicate returns failure with that error', () => {
    const t = tryTo(Dev.Sander).filter(d => {
      devToError(d);
      return true;
    });
    expect(t).not.toBeValid();
    expect(t.error.message).toBe(`Dev ${Dev.Sander} goes wrong`);
  });

  test('filter miss can be recovered', () => {
    expect(
      tryTo(Dev.Sander)
        .filter(() => false)
        .recover(() => Dev.Wouter).value
    ).toBe(Dev.Wouter);
  });

  test('thrown function is kept as the error and never invoked', () => {
    const thrown = jest.fn(() => new Error('replacement'));
    const fromOf = tryTo(() => {
      throw thrown;
    });
    const fromFilter = tryTo(Dev.Sander).filter(() => {
      throw thrown;
    });
    expect(fromOf.error).toBe(thrown);
    expect(fromFilter.error).toBe(thrown);
    expect(fromOf.map(devToId).error).toBe(thrown);
    expect(tryTo(() => fromOf.value).error).toBe(thrown);
    expect(thrown).not.toHaveBeenCalled();
  });

  test('success has no error', () => {
    expect(() => tryTo(Dev.Sander).error).toThrow('No error found');
  });

  // contract: of

  test('of passes extra arguments to the function', () => {
    expect(tryTo((a: number, b: number) => a + b, 2, 3).value).toBe(5);
  });

  test('of keeps the exact thrown error and value rethrows it', () => {
    const error = new NotValidError('exact');
    const t = tryTo(() => {
      throw error;
    });
    expect(t.error).toBe(error);
    expect(t.error).toBe(t.error);
    expect(tryTo(() => t.value).error).toBe(error);
  });

  test.each([['a string'], [42], [undefined], [null]])('of keeps a thrown non-error value %p', thrown => {
    const t = tryTo(() => {
      throw thrown;
    });
    expect(t).not.toBeValid();
    expect(t.error).toBe(thrown);
  });

  test('of a nested success unwraps its value', () => {
    expect(tryTo(() => tryTo(() => tryTo(Dev.Rob))).value).toBe(Dev.Rob);
  });

  test('of a nested failure keeps its error', () => {
    const inner = tryTo(divByZero);
    const t = tryTo(() => inner);
    expect(t).not.toBeValid();
    expect(t.error).toBe(inner.error);
  });

  // contract: map

  test('map flattens a returned try', () => {
    expect(tryTo(Dev.Sander).map(d => tryTo(() => devToId(d))).value).toBe(devToId(Dev.Sander));
    expect(tryTo(Dev.Sander).map(() => tryTo(divByZero))).not.toBeValid();
  });

  test('map on failure keeps the error and never calls the function', () => {
    const f = jest.fn(devToId);
    const failure = tryTo<Dev>(divByZero);
    const mapped = failure.map(f);
    expect(mapped.error).toBe(failure.error);
    expect(f).not.toHaveBeenCalled();
  });

  test('map with a throwing function fails with that error', () => {
    expect(tryTo(Dev.Sander).map(devToError).error.message).toBe(`Dev ${Dev.Sander} goes wrong`);
  });

  // contract: accept

  test('accept on success calls the function with the value and returns the same value', () => {
    const f = jest.fn();
    expect(tryTo(Dev.Sander).accept(f).value).toBe(Dev.Sander);
    expect(f).toHaveBeenCalledWith(Dev.Sander);
  });

  test('accept on failure never calls the function and keeps the error', () => {
    const f = jest.fn();
    const failure = tryTo<Dev>(divByZero);
    expect(failure.accept(f).error).toBe(failure.error);
    expect(f).not.toHaveBeenCalled();
  });

  // contract: recover

  test('recover on success never calls the function', () => {
    const f = jest.fn(() => Dev.Wouter);
    expect(tryTo(Dev.Sander).recover(f).value).toBe(Dev.Sander);
    expect(f).not.toHaveBeenCalled();
  });

  test('recover receives the error', () => {
    const f = jest.fn(() => Dev.Wouter);
    const failure = tryTo<Dev>(divByZero);
    failure.recover(f);
    expect(f).toHaveBeenCalledWith(failure.error);
  });

  test('recover receives the filter miss error', () => {
    const f = jest.fn((e: Error) => e.message.length);
    expect(
      tryTo(6)
        .filter(n => n > 10)
        .recover(f).value
    ).toBe('Applying filter(n => n > 10) failed.'.length);
    expect(f.mock.calls[0][0].message).toBe('Applying filter(n => n > 10) failed.');
  });

  test('recover flattens a returned try', () => {
    expect(tryTo<Dev>(divByZero).recover(() => tryTo(Dev.Wouter)).value).toBe(Dev.Wouter);
    expect(tryTo<Dev>(divByZero).recover(() => tryTo<Dev>(divByZero))).not.toBeValid();
  });

  test('recover with a throwing function fails with the new error', () => {
    expect(tryTo<Dev>(divByZero).recover(() => devToError(Dev.Wouter)).error.message).toBe(`Dev ${Dev.Wouter} goes wrong`);
  });

  // contract: recoverFrom

  test('recover from a matching error receives the error', () => {
    const f = jest.fn(() => Dev.Wouter);
    const failure = tryTo(() => devToNotValidError(Dev.Sander));
    expect(failure.recoverFrom(NotValidError, f).value).toBe(Dev.Wouter);
    expect(f).toHaveBeenCalledWith(failure.error);
  });

  test('recover from a different error keeps the error and never calls the function', () => {
    const f = jest.fn(() => Dev.Wouter);
    const failure = tryTo<Dev>(divByZero);
    expect(failure.recoverFrom(NotValidError, f).error).toBe(failure.error);
    expect(f).not.toHaveBeenCalled();
  });

  test('recover from a filter miss matches Error', () => {
    expect(
      tryTo(Dev.Sander)
        .filter(() => false)
        .recoverFrom(Error, () => Dev.Wouter).value
    ).toBe(Dev.Wouter);
  });

  // contract: filter

  test('filter hit keeps the value and passes it to the predicate', () => {
    const predicate = jest.fn(() => true);
    expect(tryTo(Dev.Sander).filter(predicate).value).toBe(Dev.Sander);
    expect(predicate).toHaveBeenCalledWith(Dev.Sander);
  });

  test('filter on failure never calls the predicate and keeps the error', () => {
    const predicate = jest.fn(() => true);
    const failure = tryTo<Dev>(divByZero);
    expect(failure.filter(predicate)).toBe(failure);
    expect(predicate).not.toHaveBeenCalled();
  });

  test('filter miss error describes the predicate', () => {
    const t = tryTo(6).filter(n => n > 10);
    expect(t.error).toBeInstanceOf(Error);
    expect(t.error.message).toBe('Applying filter(n => n > 10) failed.');
    expect(() => t.value).toThrow('Applying filter(n => n > 10) failed.');
  });

  test('second filter miss keeps the first error', () => {
    const first = tryTo(6).filter(n => n > 10);
    expect(first.filter(n => n > 20).error).toBe(first.error);
  });

  test('is checks on a miss fail with a filter error', () => {
    // dotAll: under coverage instrumentation the predicate source spans several lines.
    expect(tryTo<unknown>(undefined).is.defined().error.message).toMatch(/^Applying filter\(.*\) failed\.$/s);
    expect(tryTo(Dev.Sander).is.not.defined().error.message).toMatch(/^Applying filter\(.*\) failed\.$/s);
  });

  // contract: or, orElse, orThrow

  test('or on success returns the value and never calls the fallback', () => {
    const fallback = jest.fn(() => Dev.Wouter);
    expect(tryTo(Dev.Sander).or(fallback)).toBe(Dev.Sander);
    expect(fallback).not.toHaveBeenCalled();
  });

  test('or on failure returns the fallback', () => {
    expect(tryTo<Dev>(divByZero).or(Dev.Wouter)).toBe(Dev.Wouter);
    expect(tryTo<Dev>(divByZero).or(() => Dev.Wouter)).toBe(Dev.Wouter);
    expect(
      tryTo(Dev.Sander)
        .filter(() => false)
        .or(Dev.Wouter)
    ).toBe(Dev.Wouter);
  });

  test('or else without a fallback returns undefined on failure', () => {
    expect(tryTo<Dev>(divByZero).orElse()).toBeUndefined();
    expect(
      tryTo(Dev.Sander)
        .filter(() => false)
        .orElse()
    ).toBeUndefined();
  });

  test('or throw on failure throws the given error, not the original', () => {
    expect(() => tryTo<Dev>(divByZero).orThrow(NotValidError)).toThrow(NotValidError);
    expect(() => tryTo<Dev>(divByZero).orThrow(new NotValidError('given'))).toThrow('given');
  });

  // contract: isValid

  test('is valid reports success and failure', () => {
    expect(tryTo(Dev.Sander).isValid).toBe(true);
    expect(tryTo(divByZero).isValid).toBe(false);
    expect(tryTo(Dev.Sander).filter(() => false).isValid).toBe(false);
  });

  // is

  test.each(successes)('is defined on successes returns original value', s => {
    expect(tryTo(s).is.defined().value).toBeInstanceOf(Dev);
  });

  test('is defined on property', () => {
    expect(tryTo(Dev.Wouter).is.defined(d => d.name)).toBeValid();
    expect(tryTo(Dev.Wouter).is.defined(d => d.name).value).toBeInstanceOf(Dev);
  });

  test.each(errors)('is defined on failure returns failure', s => {
    expect(tryTo(s).is.defined()).not.toBeValid();
  });

  test.each(successes)('is empty on successes returns original value', s => {
    expect(tryTo(s).is.empty()).not.toBeValid();
  });

  test('is empty on property', () => {
    expect(tryTo({ name: undefined }).is.empty(d => d.name)).toBeValid();
  });

  test.each(errors)('is empty on failure returns failure', s => {
    expect(tryTo(s).is.empty()).not.toBeValid();
  });

  test.each(valids)('is valid on successes returns original value', s => {
    expect(tryTo(s).is.valid().value).toBeInstanceOf(Dev);
  });

  test('is valid on property', () => {
    expect(tryTo(Dev.Wouter).is.valid(d => d)).toBeValid();
    expect(tryTo(Dev.Wouter).is.valid(d => d).value).toBeInstanceOf(Dev);
  });

  test.each(errors)('is valid on failure returns failure', s => {
    expect(tryTo(s).is.valid()).not.toBeValid();
  });

  test('is true on property', () => {
    expect(tryTo(Dev.Wouter).is.true(() => true)).toBeValid();
    expect(tryTo(Dev.Wouter).is.true(() => true).value).toBeInstanceOf(Dev);
  });

  test('is false on property', () => {
    expect(tryTo(Dev.Wouter).is.false(() => false)).toBeValid();
    expect(tryTo(Dev.Wouter).is.false(() => false).value).toBeInstanceOf(Dev);
  });

  // is.not

  test.each(successes)('is not defined on successes returns original value', s => {
    expect(tryTo(s).is.not.defined()).not.toBeValid();
  });

  test('is not defined on property', () => {
    expect(tryTo({ name: undefined }).is.defined(d => d.name)).not.toBeValid();
  });

  test.each(errors)('is not defined on failure returns failure', s => {
    expect(tryTo(s).is.not.defined()).not.toBeValid();
  });

  test.each(successes)('is not empty on successes returns original value', s => {
    expect(tryTo(s).is.not.empty().value).toBeInstanceOf(Dev);
  });

  test('is not empty on property', () => {
    expect(tryTo(Dev.Wouter).is.not.empty(d => d.name)).toBeValid();
    expect(tryTo(Dev.Wouter).is.not.empty(d => d.name).value).toBeInstanceOf(Dev);
  });

  test.each(errors)('is not empty on failure returns failure', s => {
    expect(tryTo(s).is.not.empty()).not.toBeValid();
  });

  test.each(valids)('is not valid on successes returns original value', s => {
    expect(tryTo(s).is.not.valid()).not.toBeValid();
  });

  test('is not valid on property', () => {
    expect(tryTo(Dev.Invalid).is.valid(d => d)).not.toBeValid();
  });

  test.each(errors)('is not valid on failure returns failure', s => {
    expect(tryTo(s).is.not.valid()).not.toBeValid();
  });

  test.each(valids)('is not valid on successes returns original value', s => {
    expect(
      tryTo(s)
        .map(() => true)
        .is.true()
    ).toBeValid();
  });

  test.each(errors)('is not valid on failure returns failure', s => {
    expect(
      tryTo(s)
        .map(() => false)
        .is.false()
    ).not.toBeValid();
  });

  // orElse

  test.each(successes)('or else with successes returns original value', s => {
    expect(tryTo(s).orElse(Dev.Wouter)).not.toBe(Dev.Wouter);
  });

  test.each(successes)('or else with successes returns original value', s => {
    expect(
      tryTo(s)
        .filter(() => false)
        .orElse(Dev.Wouter)
    ).toBe(Dev.Wouter);
  });

  // orGet

  test('or function is called', () => {
    const func = mock.return(3);
    const res = tryTo(() => 6)
      .filter(b => b !== 6)
      .orElse(func);
    expect(res).toBe(3);
    expect(func).toHaveBeenCalled();
  });

  test('or function is never called', () => {
    const func = mock.return(3);
    const res = tryTo(() => 6)
      .filter(b => b === 6)
      .orElse(func);
    expect(res).toBe(6);
    expect(func).not.toHaveBeenCalled();
  });

  // orThrow

  test.each(successes)('or throw with successes returns original value', s => {
    expect(tryTo(s).orThrow(NotValidError)).toBeInstanceOf(Dev);
  });

  test.each(successes)('or throw with failure to throw specific error', s => {
    expect(() =>
      tryTo(s)
        .filter(() => false)
        .orThrow(() => new NotValidError('Bummer'))
    ).toThrow(NotValidError);
  });
});
