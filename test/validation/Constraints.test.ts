import { defined, gt, gte, includes, inList, lt, lte, required, validate } from '../../src/validation';
import { Record } from '../../src/domain';
import "@thisisagile/easy-test";

describe('Constraints', () => {

  class Tester extends Record {
    @defined() readonly first = this.state.first;
    @required() readonly last = this.state.first;
    @includes("and") readonly middle = this.state.first;
    @inList(["Sander", "Jeroen"]) readonly title = this.state.first;
    @lt(10) readonly one = this.state.one;
    @lte(10) readonly two = this.state.one;
    @gt(4) readonly three = this.state.two;
    @gte(4) readonly four = this.state.two;
  }

  test('All constraints succeed.', () => {
      const t = new Tester({ first: 'Sander', one: 6, two: 6 });
      expect(validate(t)).toBeValid();
    });

  test('All constraints fail.', () => {
      const t = new Tester({ one: 42, two: 0 });
    expect(validate(t)).not.toBeValid();
    });
});
