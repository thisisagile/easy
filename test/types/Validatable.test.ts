import { Dev } from '../ref';
import { isValidatable } from '../../src';
import { Validatable } from '@thisisagile/easy-test/dist/utils/Types';
import { mock } from '@thisisagile/easy-test';

class ValidateMe implements Validatable {
  constructor(readonly f: () => boolean) {
  }

  get isValid(): boolean {
    return this.f();
  }
}

class ValidateMeToo extends ValidateMe {
}

describe('Validatable', () => {
  test('isValidatable works', () => {
    expect(isValidatable()).toBeFalsy();
    expect(isValidatable(undefined)).toBeFalsy();
    expect(isValidatable(null)).toBeFalsy();
    expect(isValidatable({})).toBeFalsy();
    expect(isValidatable({ name: 'Sander' })).toBeFalsy();
    expect(isValidatable([])).toBeFalsy();
    expect(isValidatable([{ name: 'Sander' }])).toBeFalsy();
    expect(isValidatable({ isValid: true })).toBeTruthy();
    expect(isValidatable(Dev.Sander)).toBeTruthy();
  });

  test('does it call the isValid', () => {
    const func = mock.return(true);
    const val = new ValidateMeToo(func);
    expect(isValidatable(val)).toBeTruthy();
    expect(func).not.toHaveBeenCalled();
  });

  test('is validate', () => {
    expect(isValidatable(8)).not.toBeTruthy();
  });
});
