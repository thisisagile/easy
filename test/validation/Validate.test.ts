import { Dev, Language } from '../ref';
import { includes, validate, validateReject } from '../../src';
import '@thisisagile/easy-test';

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
    const higher = Dev.Sander.update({ level: 11 });
    const lower = Dev.Sander.update({ level: -1 });
    expect(validate(dev)).not.toBeValid();
    expect(validate(higher)).toHaveLength(1);
    expect(validate(lower)).toHaveLength(1);
    expect(validate(dev)).toHaveLength(3);
  });

  test('Works on valid objects', () => {
    const dev = Dev.Sander;
    expect(validate(dev)).toBeValid();
    expect(validate(dev)).toHaveLength(0);
  });

  test('Works on enums', () => {
    expect(validate(Language.Java)).toBeValid();
    expect(validate(Language.byId('HTML'))).not.toBeValid();
  });

  test('Works on inherited objects', () => {
    const b = new Below();
    expect(validate(b)).not.toBeValid();
    expect(validate(b)).toHaveLength(2);
  });
});

describe('validateReject', () => {
  test('Resolves when ok', () => {
    expect(validate(Dev.Sander)).toBeValid();
    return expect(validateReject(Dev.Sander)).resolves.toBe(Dev.Sander);
  });

  test('Rejects when fails', () => {
    return expect(validateReject(new Dev({ level: 1 }))).rejects.not.toBeValid();
  });
});
