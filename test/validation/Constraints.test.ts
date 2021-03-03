import { days, defined, future, gt, gte, includes, inList, lt, lte, past, Struct, required, valid, validate, notEmpty } from '../../src';
import '@thisisagile/easy-test';
import { Language } from '../ref';

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
    const t = new Tester({ first: 'Sander', one: 6, two: 6, past: days.yesterday(), future: days.tomorrow(), language: 'java', title: 'Prof.' });
    const r = validate(t);
    expect(r).toBeValid();
  });

  test('All constraints fail.', () => {
    const t = new Tester({ one: 42, two: 0 });
    const r = validate(t);
    expect(r).not.toBeValid();
  });
});
