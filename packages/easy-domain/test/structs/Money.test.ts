import '@thisisagile/easy-test';
import { Currency, isMoney, money, Money } from '../../src';

describe('Money', () => {
  const m = new Money({ currency: Currency.EUR.id, value: 42 });

  test('real money', () => {
    const m = new Money({ currency: Currency.USD.id, value: 42 });
    expect(m.currency).toBe(Currency.USD);
    expect(m.value).toBe(42);
  });

  test('add', () => {
    const m2 = m.add(42);
    expect(m2.currency).toBe(m.currency);
    expect(m2.value).toBe(84);
  });

  test('subtract', () => {
    const m2 = m.subtract(42);
    expect(m2.currency).toBe(m.currency);
    expect(m2.value).toBe(0);
  });

  test('times', () => {
    const m2 = m.times(4);
    expect(m2.currency).toBe(m.currency);
    expect(m2.value).toBe(168);
  });

  test('toString', () => {
    expect(m).toMatchText('€ 42.00');
    expect(money(Currency.GBP, 16)).toMatchText('£ 16.00');
    expect(new Money({ value: 42 })).toMatchText('42.00');
  });

  test('invalid', () => {
    expect(new Money()).not.toBeValid();
    expect(new Money({ currency: 'wrong' })).not.toBeValid();
    expect(new Money({ currency: 'wrong', value: 0 })).not.toBeValid();
    expect(new Money({ value: 0 })).not.toBeValid();
    expect(new Money({ currency: 'EUR', value: 0 })).toBeValid();
  });

  test.each(['€ 7.25', ' €7.25 ', ' 7.25 € ', ' €7,25 ', ' 7,25 ', ' 7.25 '])('Parse %s', value => {
    expect(Money.parse(value)).toMatchObject(new Money({ currency: 'EUR', value: 7.25 }));
  });

  test.each([
    { value: '$ 8.25', currency: 'USD' },
    { value: 'zł 8.25', currency: 'PLN' },
    { value: '£ 8.25', currency: 'GBP' },
  ])('parse other currencies', ({ value, currency }) => {
    expect(Money.parse(value)).toMatchObject(new Money({ currency, value: 8.25 }));
  });

  test.each(['€ 1,234.56', '€ 1.234,56', '1234.56 €', '€1.234,56'])('Parse grouped %s', value => {
    expect(Money.parse(value)).toMatchObject(new Money({ currency: 'EUR', value: 1234.56 }));
  });

  test.each([
    { value: '-7.25', currency: 'EUR', amount: -7.25 },
    { value: '€ -7.25', currency: 'EUR', amount: -7.25 },
    { value: '$ -1.234,56', currency: 'USD', amount: -1234.56 },
  ])('parse negative $value', ({ value, currency, amount }) => {
    expect(Money.parse(value)).toMatchObject(new Money({ currency, value: amount }));
  });

  test('parse ambiguous single comma assumes decimal', () => {
    expect(Money.parse('1,234')).toMatchObject(new Money({ currency: 'EUR', value: 1.234 }));
  });

  test('parse with number', ()=> {
    expect(Money.parse(1234.56)).toMatchObject(new Money({ currency: 'EUR', value: 1234.56 }));
  })

  test.each([undefined, null, '', 'abc', '€', {}, []])('parse unparseable %s returns undefined', value => {
    expect(Money.parse(value)).toBeUndefined();
  });

  test('parse with money', () => {
    expect(Money.parse(money(Currency.EUR, 8.25))).toMatchObject(money(Currency.EUR, 8.25));
  });
});

describe('isMoney', () => {
  test('false', () => {
    expect(isMoney()).toBeFalsy();
    expect(isMoney({})).toBeFalsy();
    expect(isMoney('EUR')).toBeFalsy();
    expect(isMoney(42)).toBeFalsy();
  });
  test('true', () => {
    expect(isMoney(money(Currency.EUR, 42))).toBeTruthy();
  });
});
