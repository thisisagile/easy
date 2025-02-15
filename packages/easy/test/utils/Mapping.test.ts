import { Json, JsonValue, Mapper, mappings } from '../../src';

const site = 'www.acme.com';
const city = 'Amsterdam';
const CityName = 'Amsterdam';
const country = 'NL';
const Country = 'NL';

describe('Mapper', () => {
  test('empty mapper should return original in', () => {
    const scratch = new Mapper().in({ CityName, Country });
    expect(scratch).toStrictEqual({});
    const source = new Mapper({ startFrom: 'source' }).in({ CityName, Country });
    expect(source).toStrictEqual({ CityName, Country });
  });

  test('empty mapper should return original out', () => {
    const scratch = new Mapper().out({ CityName, Country });
    expect(scratch).toStrictEqual({});
    const source = new Mapper({ startFrom: 'source' }).out({ CityName, Country });
    expect(source).toStrictEqual({ CityName, Country });
  });

  class SingleMapper extends Mapper {
    readonly city = this.map.item('CityName');
  }

  test('single should return in', () => {
    const scratch = new SingleMapper().in({ CityName, Country });
    expect(scratch).toStrictEqual({ city });
    const source = new SingleMapper({ startFrom: 'source' }).in({ CityName, Country });
    expect(source).toStrictEqual({ city, Country });
  });

  test('single should return out', () => {
    const scratch = new SingleMapper().out({ city, Country });
    expect(scratch).toStrictEqual({ CityName });
    const source = new SingleMapper({ startFrom: 'source' }).out({ city, Country });
    expect(source).toStrictEqual({ CityName, Country });
  });

  class InheritedMapper extends Mapper {
    public readonly map = { ...mappings, field: mappings.item };
    readonly city = this.map.field('CityName');
  }

  test('altered map should return in', () => {
    const scratch = new InheritedMapper().in({ CityName, Country });
    expect(scratch).toStrictEqual({ city });
    const source = new InheritedMapper({ startFrom: 'source' }).in({ CityName, Country });
    expect(source).toStrictEqual({ city, Country });
  });

  test('altered map should return out', () => {
    const scratch = new InheritedMapper().out({ city, Country });
    expect(scratch).toStrictEqual({ CityName });
    const source = new InheritedMapper({ startFrom: 'source' }).out({ city, Country });
    expect(source).toStrictEqual({ CityName, Country });
  });

  class IgnoreMapper extends Mapper {
    readonly city = this.map.ignore('CityName');
    readonly country = this.map.item('Country');
  }

  test('ignore should return in', () => {
    const scratch = new IgnoreMapper().in({ CityName, Country });
    expect(scratch).toStrictEqual({ country });
    const source = new IgnoreMapper({ startFrom: 'source' }).in({ CityName, Country });
    expect(source).toStrictEqual({ country });
  });

  test('ignore should return out', () => {
    const scratch = new IgnoreMapper().out({ city, country });
    expect(scratch).toStrictEqual({ Country });
    const source = new IgnoreMapper({ startFrom: 'source' }).out({ city, country });
    expect(source).toStrictEqual({ Country });
  });

  const region = (a: Json): string => (a.CityName === city ? 'city' : 'farmers');
  const listMe = (a: Json): JsonValue[] => [a.city, a.region, a.country];

  class FuncMapper extends Mapper {
    readonly city = this.map.item('CityName');
    readonly country = this.map.func('Country', 'NL', 'nl');
    readonly region = this.map.add(a => region(a));
    readonly list = this.map.add(a => listMe(a));
    readonly extension = this.map.func('Extension', 'ex', undefined);
    readonly useless = this.map.func('Useless', undefined, undefined);
  }

  test('func should return in', () => {
    const scratch = new FuncMapper().in({ CityName });
    expect(scratch).toStrictEqual({
      city,
      country,
      region: 'city',
      list: ['Amsterdam', 'city', 'NL'],
      extension: 'ex',
    });
    const source = new FuncMapper({ startFrom: 'source' }).in({ CityName });
    expect(source).toStrictEqual({
      city,
      country,
      region: 'city',
      list: ['Amsterdam', 'city', 'NL'],
      extension: 'ex',
    });
  });

  test('func should return out', () => {
    const scratch = new FuncMapper().out({ city, Country });
    expect(scratch).toStrictEqual({ CityName, Country: 'nl' });
    const source = new FuncMapper({ startFrom: 'source' }).out({ city, Country });
    expect(source).toStrictEqual({ CityName, Country: 'nl' });
  });

  class DoubleColumnMapper extends Mapper {
    readonly id = this.map.item('Id');
    readonly classicId = this.map.item('Id');
  }

  test('double columns should return in', () => {
    const scratch = new DoubleColumnMapper().in({ Id: 42, Country });
    expect(scratch).toStrictEqual({ id: 42, classicId: 42 });
    const source = new DoubleColumnMapper({ startFrom: 'source' }).in({ Id: 42, Country });
    expect(source).toStrictEqual({ id: 42, classicId: 42, Country });
  });

  test('double columns should return out', () => {
    const scratch = new DoubleColumnMapper().out({ id: 42, classicId: 42, Country });
    expect(scratch).toStrictEqual({ Id: 42 });
    const source = new DoubleColumnMapper({ startFrom: 'source' }).out({
      id: 42,
      classicId: 42,
      Country,
    });
    expect(source).toStrictEqual({ Id: 42, Country });
  });

  class CompanyMapper extends Mapper {
    readonly title = this.map.item('Name');
    readonly site = this.map.item('Website');
  }

  class UseMapperMapper extends Mapper {
    readonly id = this.map.item('Id');
    readonly company = this.map.map(new CompanyMapper());
  }

  test('sub maps should return in', () => {
    const scratch = new UseMapperMapper().in({ Id: 42, Country, Name: 'Acme', Website: site });
    expect(scratch).toStrictEqual({ id: 42, company: { title: 'Acme', site } });
    const source = new UseMapperMapper({ startFrom: 'source' }).in({
      Id: 42,
      Country,
      Name: 'Google',
      Website: site,
    });
    expect(source).toStrictEqual({
      id: 42,
      Country,
      Name: 'Google',
      Website: site,
      company: { title: 'Google', site },
    });
  });

  test('sub maps should return out', () => {
    const scratch = new UseMapperMapper().out({ id: 42, company: { title: 'Acme', site } });
    expect(scratch).toStrictEqual({ Id: 42, Name: 'Acme', Website: site });
    const source = new UseMapperMapper({ startFrom: 'source' }).out({
      id: 42,
      company: { title: 'Acme', site },
    });
    expect(source).toStrictEqual({ Id: 42, Name: 'Acme', Website: site });
  });

  class UseMapperPropertyMapper extends Mapper {
    readonly id = this.map.item('Id');
    readonly company = this.map.map(new CompanyMapper(), 'Company');
  }

  test('sub maps from sub object should return in', () => {
    const scratch = new UseMapperPropertyMapper().in({
      Id: 42,
      Country,
      Company: { Name: 'Acme', Website: site },
    });
    expect(scratch).toStrictEqual({ id: 42, company: { title: 'Acme', site } });
    const source = new UseMapperPropertyMapper({ startFrom: 'source' }).in({
      Id: 42,
      Country,
      Company: { Name: 'Google', Website: site },
    });
    expect(source).toStrictEqual({ id: 42, Country, company: { title: 'Google', site } });
  });

  test('sub maps from sub object should return out', () => {
    const scratch = new UseMapperPropertyMapper().out({ id: 42, company: { title: 'Acme', site } });
    expect(scratch).toStrictEqual({ Id: 42, Company: { Name: 'Acme', Website: site } });
    const source = new UseMapperPropertyMapper({ startFrom: 'source' }).out({
      id: 42,
      company: { title: 'Acme', site },
    });
    expect(source).toStrictEqual({ Id: 42, Company: { Name: 'Acme', Website: site } });
  });

  class ListMapper extends Mapper {
    readonly id = this.map.item('Id');
    readonly companies = this.map.propsToList(this.map.map(CompanyMapper, 'Company'), this.map.map(CompanyMapper, 'StartUp'));
    readonly company = this.map.skipIn('Company');
    readonly startup = this.map.skipIn('StartUp');
  }

  test('list should return in', () => {
    const scratch = new ListMapper().in({
      Id: 42,
      Company: { Name: 'Acme', Website: site },
      StartUp: { Name: 'AcmeB', Website: site },
    });
    expect(scratch).toStrictEqual({
      id: 42,
      companies: [
        { title: 'Acme', site },
        { title: 'AcmeB', site },
      ],
    });
    const source = new ListMapper({ startFrom: 'source' }).in({
      Id: 42,
      Company: { Name: 'Google', Website: site },
      StartUp: { Name: 'GoogleB', Website: site },
    });
    expect(source).toStrictEqual({
      id: 42,
      companies: [
        { title: 'Google', site },
        { title: 'GoogleB', site },
      ],
    });
  });

  test('list should return out', () => {
    const scratch = new ListMapper().out({
      id: 42,
      companies: [
        { title: 'Google', site },
        { title: 'GoogleB', site },
      ],
    });
    expect(scratch).toStrictEqual({
      Id: 42,
      Company: { Name: 'Google', Website: site },
      StartUp: { Name: 'GoogleB', Website: site },
    });
    const source = new ListMapper({ startFrom: 'source' }).out({
      id: 42,
      companies: [
        { title: 'Google', site },
        { title: 'GoogleB', site },
      ],
    });
    expect(source).toStrictEqual({
      Id: 42,
      Company: { Name: 'Google', Website: site },
      StartUp: { Name: 'GoogleB', Website: site },
    });
  });
});

describe('mappings', () => {
  test('item works', () => {
    const source = { CityName, Country };
    const scratch = mappings.item('CityName').in(source);
    expect(scratch).toBe(CityName);
    const result = mappings.item('CityName').out(source);
    expect(result).toBeUndefined();
  });

  test('ignore works', () => {
    const source = { CityName, Country };
    const scratch = mappings.ignore('CityName').in(source);
    expect(scratch).toBeUndefined();
    const result = mappings.ignore('CityName').out(source);
    expect(result).toBeUndefined();
  });

  test('skipIn works', () => {
    const source = { CityName, Country };
    const scratch = mappings.skipIn('CityName').in(source);
    expect(scratch).toBeUndefined();
    const result = mappings.skipIn('CityName').out(source);
    expect(result).toBe(CityName);
  });

  test('skipOut works', () => {
    const source = { CityName, Country };
    const scratch = mappings.skipOut('CityName').in(source);
    expect(scratch).toBe(CityName);
    const result = mappings.skipOut('CityName').out(source);
    expect(result).toBeUndefined();
  });

  test('func works', () => {
    const source = { CityName, Country };
    const scratch = mappings
      .func(
        'CityName',
        a => a.CityName,
        a => a.CityName
      )
      .in(source);
    expect(scratch).toBe(CityName);
    const result = mappings
      .func(
        'CityName',
        a => a.CityName,
        a => a.CityName
      )
      .out(source);
    expect(result).toBe(CityName);
  });

  test('add works', () => {
    const source = { CityName, Country };
    const scratch = mappings.add(a => a.CityName).in(source);
    expect(scratch).toBe(CityName);
    const result = mappings.add(a => a.CityName).out(source);
    expect(result).toBeUndefined();
  });

  test('map works', () => {
    const source = { CityName, Country };
    const scratch = mappings.map(new Mapper(), 'CityName').in(source);
    expect(scratch).toStrictEqual({});
    const result = mappings.map(new Mapper(), 'CityName').out(source);
    expect(result).toStrictEqual({});
  });

  test('propsToList works', () => {
    const source = { CityName, Country };
    const scratch = mappings.propsToList(mappings.item('CityName'), mappings.item('Country')).in(source);
    expect(scratch).toStrictEqual([CityName, Country]);
  });
});
