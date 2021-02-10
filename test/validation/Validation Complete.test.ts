import {
  asText,
  choose,
  constraint,
  Entity,
  Enum,
  includes,
  isDefined,
  isEnum,
  isValidatable,
  isValue,
  List,
  list,
  meta,
  required,
  Results,
  results,
  Struct,
  Text,
  Validator,
  Value,
} from '../../src';
import '@thisisagile/easy-test';

const isValid = (message?: Text): PropertyDecorator => constraint(v => valid(v).isValid, message ?? 'Property {property} must be valid.');

class Price extends Value<number> {
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

class ConstrainedBrand extends Struct {
  @required() readonly name: string = this.state.name;
  @includes('www.') @includes('.io') readonly site: string = this.state.site;
}

class Product extends Entity {
  readonly name: string = this.state.name;
  readonly brand: Brand = new Brand(this.state.brand);
  readonly type: Type = Type.byId(this.state.type);
  readonly price: Price = new Price(this.state.price);
}

class ConstrainedProduct extends Entity {
  @required() readonly name: string = this.state.name;
  @isValid() readonly brand: Brand = new Brand(this.state.brand);
  @isValid() readonly type: Type = Type.byId(this.state.type);
  @isValid() readonly price: Price = new Price(this.state.price);
}

const contraints = (subject: unknown): List<Validator> =>
  meta(subject)
    .keys<List<Validator>>('constraint')
    .reduce((list, vs) => list.add(vs), list<Validator>());

const val = (subject: unknown): Results => {
  return contraints(subject)
    .mapDefined(v => {
      v.actual = (subject as any)[v.property];
      return !v.constraint(v.actual) ? results(asText(subject, v.text, v)) : undefined;
    })
    .reduce((rs, r) => rs.add(r), results());
};

const valid = (subject?: unknown): Results => {
  return choose<Results, unknown>(subject)
    .case(s => !isDefined(s), results('Subject is not defined.'))
    .case(
      s => isEnum(s),
      (e: Enum) => (e.isValid ? results() : results(asText(e, 'This is not a valid {type.name}.'))),
    )
    .case(
      s => isValue(s),
      (v: Value) => (v.isValid ? results() : results(asText(v, 'This is not a valid {type.name}.'))),
    )
    .case(
      s => isValidatable(s),
      v => val(v),
    )
    .else(results());
};

class Extra {
  constructor(readonly name: string) {
  }
}

class Email extends Value<string> {
  get isValid(): boolean {
    return this.value.includes('@');
  }
}

describe('valid', () => {
  test('simple', () => {
    expect(valid()).not.toBeValid();
    expect(valid(undefined)).not.toBeValid();
    expect(valid(null)).not.toBeValid();
    expect(valid({})).toBeValid();
    expect(valid({ name: 'Kim' })).toBeValid();
    expect(valid('Kim')).toBeValid();
    expect(valid(42)).toBeValid();
    expect(valid(new Extra('Kim'))).toBeValid();
  });

  test('enum', () => {
    expect(valid(Type.Plug)).toBeValid();
    expect(valid(Type.byId(Type.Plug.id))).toBeValid();
    expect(valid(Type.byId(666))).not.toBeValid();
  });

  test('value', () => {
    expect(valid(new Email('sander@ditisagile.nl'))).toBeValid();
    expect(valid(new Email(''))).not.toBeValid();
  });

  test('struct with constraints', () => {
    expect(valid(new Brand())).toBeValid();
    expect(valid(new ConstrainedBrand({ name: 'easy', site: 'www.easy.io' }))).toBeValid();
    expect(valid(new ConstrainedBrand({ name: 'easy', site: 'www.easy' }))).toHaveLength(1);
    expect(valid(new ConstrainedBrand({ name: 'easy' }))).toHaveLength(2);
    expect(valid(new ConstrainedBrand())).toHaveLength(3);
  });

  test('entity without constraints', () => {
    expect(valid(new Product())).toHaveLength(1);
    expect(valid(new Product({ id: 42 }))).toBeValid();
  });

  test('entity with (nested) constraints', () => {
    expect(valid(new ConstrainedProduct())).toHaveLength(3);
    expect(valid(new ConstrainedProduct({ id: 42 }))).toHaveLength(2);
  });
});
