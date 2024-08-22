import { AnyKey, traverse } from '../../src';

class Test<T> {
  constructor(public readonly value: T) {}

  toValue = (key: AnyKey<T>) => traverse(this.value, key);
}

describe('AnyKey', () => {
  const data = {
    id: 42,
    name: { first: 'Jan', last: 'Jansen', address: { city: 'Amsterdam', country: 'NL' } },
    paid: { currency: 'EUR', cents: 3000 },
  };

  test('toValue', () => {
    const t = new Test(data);
    expect(t.toValue('id')).toBe(42);
    expect(t.toValue('name.last')).toBe('Jansen');
    expect(t.toValue('name.first')).toBe('Jan');
    expect(t.toValue('paid.cents')).toBe(3000);
    expect(t.toValue('name.address.city')).toBe('Amsterdam');
  });
});
