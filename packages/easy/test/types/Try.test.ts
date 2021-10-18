import '@thisisagile/easy-test';
import { Dev } from '../ref';
import { asString, tryTo } from '../../src';

describe('Try', () => {

  class ConstructError {
    constructor() {
      throw new Error('Error during construction');
    }
  }

  const devToId = (d: Dev): string => asString(d.id);

  const successes = [Dev, Dev.Sander, () => Dev.Jeroen, tryTo(Dev), tryTo(Dev.Rob), tryTo(() => Dev.Jeroen)];
  const valids = [Dev.Sander, () => Dev.Jeroen, tryTo(Dev.Rob), tryTo(() => Dev.Jeroen)];

  const devToError = (d: Dev): Dev => {
    throw new Error(`Dev ${d} goes wrong`);
  };

  const divByZero = (n = 0) => {
    throw new Error(`Divide ${n} by zero`);
  };
  const errors = [ConstructError, tryTo(ConstructError), divByZero, tryTo(divByZero), tryTo(() => divByZero(3))];

  // toTry

  test.each(successes)('of success', (s) => {
    expect(tryTo(s)).toBeValid();
  });

  test.each(errors)('of error', (s) => {
    expect(tryTo(s)).not.toBeValid();
  });

  // value

  test.each(successes)('value success', (s) => {
    expect(tryTo(s).value).toBeInstanceOf(Dev);
  });

  test.each(errors)('value error', (s) => {
    expect(() => tryTo(s).value).toThrow();
  });

  // map

  test.each(successes)('map success to success', (s) => {
    expect(tryTo(s).map(d => devToId(d))).toBeValid();
  });

  test.each(successes)('map success to success value is a string', (s) => {
    expect(typeof tryTo(s).map(d => devToId(d)).value).toBe('string');
  });

  test.each(successes)('map success to failure should fail', (s) => {
    expect(tryTo(s).map(d => devToError(d))).not.toBeValid();
  });

  test.each(errors)('map error', (s) => {
    expect(tryTo(s).map(e => e)).not.toBeValid();
  });

  // accept

  test.each(successes)('accept success to keep original value', (s) => {
    expect(tryTo(s).accept(d => devToId(d)).value).toBeInstanceOf(Dev);
  });

  test.each(successes)('accept failure to return failure', (s) => {
    expect(tryTo(s).accept(d => devToError(d))).not.toBeValid();
  });

  test.each(errors)('accept errors to remain failures', (s) => {
    expect(tryTo(s).accept(e => e)).not.toBeValid();
  });

  // recover

  test.each(successes)('recover success to keep original value', (s) => {
    expect(tryTo(s).recover(() => Dev.Wouter).value).not.toBe(Dev.Wouter);
  });

  test.each(successes)('recover from error to return valid', (s) => {
    expect(tryTo(s).map(d => devToError(d)).recover(() => Dev.Wouter).value).toBe(Dev.Wouter);
  });

  // recoverFrom

  class NotValidError extends Error {
  }

  const devToNotValidError = (d: Dev): Dev => {
    throw new NotValidError(`Dev ${d} goes wrong`);
  };
  test.each(successes)('recover from with success to keep original value', (s) => {
    expect(tryTo(s).recoverFrom(NotValidError, () => Dev.Wouter).value).not.toBe(Dev.Wouter);
  });

  test.each(successes)('recover from with different error to recover', (s) => {
    expect(tryTo(s).map(d => devToError(d)).recoverFrom(NotValidError, () => Dev.Wouter).recover(() => Dev.Sander).value).toBe(Dev.Sander);
  });

  test.each(successes)('recover from with specific error to recover', (s) => {
    expect(tryTo(s).map(d => devToNotValidError(d)).recoverFrom(NotValidError, () => Dev.Wouter).recover(() => Dev.Sander).value).toBe(Dev.Wouter);
  });

  // filter

  test.each(successes)('filter is successes is true returns original value', (s) => {
    expect(tryTo(s).filter(() => true).value).toBeInstanceOf(Dev);
  });

  test.each(successes)('filter on successes is false returns failure', (s) => {
    expect(tryTo(s).filter(() => false)).not.toBeValid();
  });

  test.each(errors)('filter on errors returns failure', (s) => {
    expect(tryTo(s).filter(() => true)).not.toBeValid();
  });

  // is

  test.each(successes)('is defined on successes returns original value', (s) => {
    expect(tryTo(s).is.defined().value).toBeInstanceOf(Dev);
  });

  test.each(errors)('is defined on failure returns failure', (s) => {
    expect(tryTo(s).is.defined()).not.toBeValid();
  });

  test.each(successes)('is empty on successes returns original value', (s) => {
    expect(tryTo(s).is.empty()).not.toBeValid();
  });

  test.each(errors)('is empty on failure returns failure', (s) => {
    expect(tryTo(s).is.empty()).not.toBeValid();
  });

  test.each(valids)('is valid on successes returns original value', (s) => {
    expect(tryTo(s).is.valid().value).toBeInstanceOf(Dev);
  });

  test.each(errors)('is valid on failure returns failure', (s) => {
    expect(tryTo(s).is.valid()).not.toBeValid();
  });

  // is.not

  test.each(successes)('is not defined on successes returns original value', (s) => {
    expect(tryTo(s).is.not.defined()).not.toBeValid();
  });

  test.each(errors)('is not defined on failure returns failure', (s) => {
    expect(tryTo(s).is.not.defined()).not.toBeValid();
  });

  test.each(successes)('is not empty on successes returns original value', (s) => {
    expect(tryTo(s).is.not.empty().value).toBeInstanceOf(Dev);
  });

  test.each(errors)('is not empty on failure returns failure', (s) => {
    expect(tryTo(s).is.not.empty()).not.toBeValid();
  });

  test.each(valids)('is not valid on successes returns original value', (s) => {
    expect(tryTo(s).is.not.valid()).not.toBeValid();
  });

  test.each(errors)('is not valid on failure returns failure', (s) => {
    expect(tryTo(s).is.not.valid()).not.toBeValid();
  });

  test.each(valids)('is not valid on successes returns original value', (s) => {
    expect(tryTo(s).map(() => true).is.true()).toBeValid();
  });

  test.each(errors)('is not valid on failure returns failure', (s) => {
    expect(tryTo(s).map(() => false).is.false()).not.toBeValid();
  });

  // orElse

  test.each(successes)('or else with successes returns original value', (s) => {
    expect(tryTo(s).orElse(Dev.Wouter)).not.toBe(Dev.Wouter);
  });

  test.each(successes)('or else with successes returns original value', (s) => {
    expect(tryTo(s).filter(() => false).orElse(Dev.Wouter)).toBe(Dev.Wouter);
  });

  // orThrow

  test.each(successes)('or throw with successes returns original value', (s) => {
    expect(tryTo(s).orThrow(NotValidError)).toBeInstanceOf(Dev);
  });

  test.each(successes)('or throw with failure to throw specific error', (s) => {
    expect(() => tryTo(s).filter(() => false).orThrow(() => new NotValidError('Bummer'))).toThrow(NotValidError);
  });
});
