import { defined, future, gt, gte, includes, inList, lt, lte, past, Record, required, validate } from '../../src';
import '@thisisagile/easy-test';

describe('Constraints', () => {

  class Tester extends Record {
    @defined() readonly first = this.state.first;
    @required() readonly last = this.state.first;
    @includes('and') readonly middle = this.state.first;
    @inList(['Sander', 'Jeroen']) readonly title = this.state.first;
    @lt(10) readonly one = this.state.one;
    @lte(10) readonly two = this.state.one;
    @gt(4) readonly three = this.state.two;
    @gte(4) readonly four = this.state.two;
    @past() readonly past = this.state.past;
    @future() readonly future = this.state.future;
  }

  test('All constraints succeed.', () => {
    const t = new Tester({ first: 'Sander', one: 6, two: 6, past: new Date("1970-1-1"), future: new Date("2070-1-1") });
    expect(validate(t)).toBeValid();
  });

  test('All constraints fail.', () => {
    const t = new Tester({ one: 42, two: 0 });
    expect(validate(t)).not.toBeValid();
  });
});
