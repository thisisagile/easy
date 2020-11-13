import { Dev } from '../ref/Dev';
import { includes, validate, validateReject } from '../../src/validation';
import { Results } from '../../src/types';

class Top {
  @includes('a') readonly name: string = 'Top';
}

class Below extends Top {
  @includes('b') readonly city: string = 'Amsterdam';
}

describe('validate', () => {

  test('Works on empty objects', () => {
    expect(validate()).toHaveLength(1);
    expect(validate(null)).toHaveLength(1);
  });

  test('Works on invalid objects', () => {
    const dev = new Dev({ level: 1 });
    expect(validate(dev)).toHaveLength(2);
  });

  test('Works on valid objects', () => {
    const dev = Dev.Sander;
    expect(validate(dev)).toHaveLength(0);
  });

  test('Works on inherited objects', () => {
    const b = new Below();
    expect(validate(b)).toHaveLength(2);
  });
});

describe('validateReject', () => {

  test('Resolves when ok', () => {
    expect(validate(Dev.Sander).isValid).toBeTruthy();
    expect(validateReject(Dev.Sander)).resolves.toBe(Dev.Sander);
  });

  test('Rejects when fails', () => {
    expect(validateReject(new Dev({ level: 1 }))).rejects.toBeInstanceOf(Results);
  });
});
