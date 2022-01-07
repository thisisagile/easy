import { meta, required, searchable, Struct } from '../../src';
import { fits } from '@thisisagile/easy-test';

describe('Tag', () => {
  class Tester extends Struct {
    @searchable() readonly first = this.state.first;
    @searchable() @required() readonly second = this.state.second;
    @searchable() readonly third = this.state.third;
    readonly fourth = this.state.fourth;
  }

  let tester: Tester;
  beforeEach(() => {
    tester = new Tester({ first: 'Rob', second: '' });
  });

  test('tags work', () => {
    const props = meta(tester).properties(searchable.name);
    expect(props).toHaveLength(3);
    expect(props).toContainEqual(fits.with({ property: 'first' }));
    expect(props).toContainEqual(fits.with({ property: 'second' }));
    expect(props).toContainEqual(fits.with({ property: 'third' }));
  });
});
