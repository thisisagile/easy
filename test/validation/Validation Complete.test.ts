import { Entity, Enum, Struct, val, validators, validate, Value, yes } from '../../src';
import '@thisisagile/easy-test';
import { Dev } from '../ref';

class Price extends Value<number> {
  @yes('Value {this.value} is not a valid price. Price must be between 0 and 100.')
  get isValid(): boolean {
    return this.value > 0 && this.value < 100;
  }
}

class Type extends Enum {
  static readonly Plug = new Type('plug');
  static readonly Bulb = new Type('bulb');
}

class Brand extends Struct {
  readonly name: string = this.state.name;
  readonly site: string = this.state.site;
}

class Product extends Entity {
  readonly name: string = this.state.name;
  readonly brand: Brand = new Brand(this.state.brand);
  readonly type: Type = Type.byId(this.state.type);
  readonly price: Price = new Price(this.state.price);
}

describe('validating a value', () => {
  const good = new Price(10);
  const bad = new Price(101);

  test('isValid', () => {
    expect(good).toBeValid();
    expect(bad).not.toBeValid();
  });

  test('validators', () => {
    expect(validators({})).toHaveLength(0);
    expect(validators(good)).toHaveLength(1);
    expect(validators(Dev.Sander)).toHaveLength(5);
  });

  test('val', () => {
    const res = validate(bad);
    expect(res).not.toBeValid();
  });
});
