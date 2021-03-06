import {
  constraint,
  days,
  defined,
  future,
  gt,
  gte,
  includes,
  inList,
  isValue,
  lt,
  lte,
  notEmpty,
  optional,
  past,
  required,
  Struct,
  Text,
  valid,
  validate,
} from '../../src';
import '@thisisagile/easy-test';
import { Age, Language } from '../ref';
import { ifDefined } from '../../src/utils/If';

describe('Constraints', () => {
  class Tester extends Struct {
    @defined() readonly first = this.state.first;
    @required() readonly last = this.state.first;
    @notEmpty() readonly prefix = this.state.title;
    @includes('and') readonly middle = this.state.first;
    @inList(['Sander', 'Jeroen']) readonly title = this.state.first;
    @lt(10) readonly one = this.state.one;
    @lte(10) readonly two = this.state.one;
    @gt(4) readonly three = this.state.two;
    @gte(4) readonly four = this.state.two;
    @past() readonly past = this.state.past;
    @future() readonly future = this.state.future;
    @valid() readonly language = Language.byId(this.state.language);
  }

  test('All constraints succeed.', () => {
    const t = new Tester({
      first: 'Sander',
      one: 6,
      two: 6,
      past: days.yesterday(),
      future: days.tomorrow(),
      language: 'java',
      title: 'Prof.',
    });
    expect(validate(t)).toBeValid();
  });

  test('All constraints fail.', () => {
    const t = new Tester({ one: 42, two: 0 });
    expect(validate(t)).not.toBeValid();
  });
});

describe('Optional constraint', () => {
  class Cat extends Struct {
    @required() readonly name = this.state.name;
    @optional() readonly age = ifDefined(this.state.age, Age);
  }

  test('Optional constraint succeeds.', () => {
    const c = new Cat({ name: 'Felix', age: 10 });
    expect(validate(c)).toBeValid();
  });

  test('Optional constraint fails.', () => {
    const c = new Cat({ name: 'Felix', age: 121 });
    expect(validate(c)).not.toBeValid();
    expect(validate(c)).toFailWith('This is not a valid age.');
  });

  test('Optional property is undefined result is still valid.', () => {
    const c = new Cat({ name: 'Felix' });
    expect(validate(c)).toBeValid();
  });
});

describe('Custom constraints', () => {
  const is42 = (message?: Text): PropertyDecorator => constraint(v => v === 42, message ?? "Property {property} should have value '42' instead of '{actual}'.");

  class Person extends Struct {
    @valid() readonly age: Age = new Age(this.state.age);
    @is42() readonly realAge: number = this.state.age;
  }

  test('age', () => {
    expect(isValue(new Age(42))).toBeTruthy();
    expect(validate(new Age(42))).toBeValid();
    expect(validate(new Age(142))).not.toBeValid();
  });

  test('person', () => {
    expect(validate(new Person({ age: 42 }))).toBeValid();
    expect(validate(new Person({ age: 142 }))).not.toBeValid();
  });

  test('custom validation', () => {
    const res = validate(new Person({ age: 142 }));
    expect(res.results).toHaveLength(2);
  });
});
