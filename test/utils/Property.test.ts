import { convert, Property } from '../../src';

describe('Property', () => {
  test('Simple prop', () => {
    const p = new Property('Id');
    expect(p).toMatchObject({ property: 'Id', options: { convert: convert.default } });
  });

  test('Prop with empty options', () => {
    const p = new Property('Id', {});
    expect(p).toMatchObject({ property: 'Id', options: { convert: convert.default } });
  });

  test('Prop with default', () => {
    const p = new Property('Id', { dflt: 3 });
    expect(p).toMatchObject({ property: 'Id', options: { dflt: 3, convert: convert.default } });
  });

  test('Prop with default and converter', () => {
    const p = new Property('Id', { dflt: 3, convert: convert.toNumber.fromString });
    expect(p).toMatchObject({ property: 'Id', options: { dflt: 3, convert: convert.toNumber.fromString } });
  });
});
