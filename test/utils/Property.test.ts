import { convert, toProperty } from '../../src';

describe('toProperty', () => {

  test('Simple prop', () => {
    const p = toProperty('Id');
    expect(p).toMatchObject({ property: 'Id', options: { convert: convert.default } });
  });

  test('Prop with empty options', () => {
    const p = toProperty('Id', {});
    expect(p).toMatchObject({ property: 'Id', options: { convert: convert.default } });
  });

  test('Prop with default', () => {
    const p = toProperty('Id', { dflt: 3 });
    expect(p).toMatchObject({ property: 'Id', options: { dflt: 3, convert: convert.default } });
  });

  test('Prop with default and converter', () => {
    const p = toProperty('Id', { dflt: 3, convert: convert.toNumber.fromString });
    expect(p).toMatchObject({ property: 'Id', options: { dflt: 3, convert: convert.toNumber.fromString } });
  });
});
