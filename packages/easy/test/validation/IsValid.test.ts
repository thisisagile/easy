import * as Exception from '../../src/types/Exception';
import { Entity, Enum, includes, required, rule, Struct, toResults, tryTo, valid, validate, Value } from '../../src';
import { isValid } from '../../src/validation/IsValid';
import '@thisisagile/easy-test';

class Price extends Value<number> {
  get isValid(): boolean {
    return this.value > 0 && this.value < 100;
  }
}

class Type extends Enum {
  static readonly Plug = new Type('plug');
  static readonly Missing = new Type('missing', null as unknown as string, 'missing');
}

class Brand extends Struct {
  @required() readonly name: string = this.state.name;
  @includes('www.') readonly site: string = this.state.site;
}

class Product extends Entity {
  @valid() readonly brand: Brand = new Brand(this.state.brand);
  @valid() readonly price: Price = new Price(this.state.price);
}

class Throwing extends Struct {
  @rule('always throws.')
  check(): boolean {
    throw Exception.IsNotValid;
  }
}

class ReturnsResults extends Struct {
  @rule('returns results.')
  check = () => toResults('nope');
}

const brand = { name: 'Philips', site: 'www.philips.com' };

describe('isValid', () => {
  test.each([
    ['undefined', undefined, false],
    ['null', null, false],
    ['a primitive', 'text', true],
    ['a plain object', { a: 1 }, true],
    ['a valid enum', Type.Plug, true],
    ['an enum without id', Type.Missing, false],
    ['a valid value', new Price(42), true],
    ['an invalid value', new Price(420), false],
    ['an empty array', [], true],
    ['an array of valid items', [new Price(1), Type.Plug], true],
    ['an array with an invalid item', [new Price(1), new Price(420)], false],
    ['a struct meeting its constraints', new Brand(brand), true],
    ['a struct missing a required property', new Brand({ site: 'www.philips.com' }), false],
    ['an entity with a valid nested struct', new Product({ id: 1, brand, price: 42 }), true],
    ['an entity with an invalid nested struct', new Product({ id: 1, brand: { name: 'Philips' }, price: 42 }), false],
    ['an entity with an invalid nested value', new Product({ id: 1, brand, price: 420 }), false],
    ['a struct whose rule throws', new Throwing({}), false],
    ['a struct whose rule returns failing results', new ReturnsResults({}), false],
    ['a validatable without constraints, whatever its own isValid', tryTo(() => Exception.IsNotValid).filter(() => false), true],
  ])('%s', (_, subject, expected) => {
    expect(isValid(subject)).toBe(expected);
    expect(validate(subject).isValid).toBe(expected);
  });
});
