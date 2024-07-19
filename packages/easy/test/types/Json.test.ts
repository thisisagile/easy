import { any, asJson, isJson, json, PageOptions, toJson } from '../../src';
import { Dev, DevTableGateway } from '../ref';
import '@thisisagile/easy-test';

describe('isJson', () => {
  test('isJson true', () => {
    expect(
      isJson({
        toJSON: () => {
          'Kim';
        },
      })
    ).toBeTruthy();
    expect(isJson(Dev.Sander)).toBeTruthy();
  });

  test('isJson false', () => {
    expect(isJson()).toBeFalsy();
    expect(isJson({})).toBeFalsy();
    expect(isJson(new DevTableGateway())).toBeFalsy();
  });
});

describe('toJson', () => {
  test('toJson nothing', () => {
    const json = toJson();
    expect(json).toMatchObject({});
  });

  test('toJson empty', () => {
    const json = toJson({});
    expect(json).toMatchObject({});
  });

  test('toJson undefined', () => {
    const json = toJson(undefined);
    expect(json).toMatchObject({});
  });

  test('toJson null', () => {
    const json = toJson(null);
    expect(json).toMatchObject({});
  });

  test('toJson simple', () => {
    const json = toJson({ name: 'Sander' });
    expect(json).toMatchObject({ name: 'Sander' });
  });

  test('toJson entity', () => {
    const json = toJson(Dev.Wouter);
    expect(json).toMatchObject({ name: 'Wouter', language: 'TypeScript', level: 3 });
  });

  test('toJson removes undefined', () => {
    const json = toJson({ name: 'Wouter', language: 'TypeScript', level: undefined });
    expect(json?.level).toBeUndefined();
  });

  test('toJson removes undefined and adds', () => {
    const json = toJson({ name: 'Wouter', language: 'TypeScript' }, { level: 3 });
    expect(json).toMatchObject({ name: 'Wouter', language: 'TypeScript', level: 3 });
  });

  test('toJson object and adds', () => {
    const json = toJson(Dev.Wouter, { level: 4 });
    expect(json).toMatchObject({ name: 'Wouter', language: 'TypeScript', level: 4 });
  });

  test('toJson object and adds object', () => {
    const j = toJson(Dev.Wouter, Dev.Naoufal);
    expect(j).toMatchObject({ id: 2, name: 'Naoufal', language: 'TypeScript', level: 3 });
  });
});

describe('asJson', () => {
  test('nothing', () => {
    const json = asJson();
    expect(json).toMatchObject({});
  });

  test('explicitly undefined', () => {
    const json = asJson(undefined);
    expect(json).toMatchObject({});
  });

  test('empty', () => {
    const j = {};
    expect(asJson(j)).toMatchJson({});
  });

  test('null', () => {
    const json = asJson(null);
    expect(json).toMatchObject({});
  });

  test('value is undefined', () => {
    const json = asJson({ prop: undefined });
    expect(json).toMatchObject({ prop: undefined });
  });

  test('target is not Json', () => {
    const j = 'Not a Json';
    expect(asJson(j)).toMatchJson({});
  });

  test('target is not Json, but there is an alt function', () => {
    const j = 'Not a Json';
    const json = asJson(j, () => Dev.Jeroen.toJSON());
    expect(json).toMatchJson({ id: 1, name: 'Jeroen' });
  });

  test('asJson simple', () => {
    const json = asJson({ name: 'Sander' });
    expect(json).toMatchObject({ name: 'Sander' });
  });

  test('asJson entity', () => {
    const j = Dev.Jeroen;
    expect(asJson(j)).toMatchJson(Dev.Jeroen.toJSON());
  });

  test('asJson alt', () => {
    const json = asJson('Javascript', { language: 'TypeScript' });
    expect(json).toMatchObject({ language: 'TypeScript' });
  });
});

describe('json', () => {
  const dev = { id: 2, name: 'Naoufal', level: 3, language: 'TypeScript' };

  test('omit empty should return what?', () => {
    const empty = json.omit({}, 'language');
    expect(empty).toStrictEqual({});
  });

  test('omit one property', () => {
    const dev2 = json.omit(dev, 'language');
    expect(dev2).toStrictEqual({ id: 2, name: 'Naoufal', level: 3 });
  });

  test('omit state', () => {
    const dev3 = json.omit(dev, 'state');
    expect(dev3).toStrictEqual({ id: 2, name: 'Naoufal', level: 3, language: 'TypeScript' });
  });

  test('omit multiple properties', () => {
    const dev4 = json.omit(dev, 'language', 'id', 'state');
    expect(dev4).toStrictEqual({ name: 'Naoufal', level: 3 });
  });

  test('merge two objects', () => {
    const j = json.merge({ level: 3 }, { age: 23 });
    expect(j).toStrictEqual({ level: 3, age: 23 });
  });

  test('merge entity with object', () => {
    const j = json.merge(Dev.Wouter, { name: 'Jeroen' });
    expect(j).toStrictEqual({ ...Dev.Wouter.toJSON(), name: 'Jeroen' });
  });

  test('merge with key with undefined value', () => {
    const javascript = { ...{ level: 3 }, ...{ level: undefined } };
    expect(javascript).toStrictEqual({ level: undefined });

    const j = json.merge({ level: 3 }, { level: undefined });
    expect(j).toStrictEqual({});
  });

  const usingDefaults = (options?: PageOptions): number => {
    const o = json.defaults(options, { take: 5 });
    return o.take;
  };

  test('defaults with a specific type', () => {
    expect(usingDefaults()).toBe(5);
    expect(usingDefaults({ take: 5 })).toBe(5);
    expect(usingDefaults({ take: 10 })).toBe(10);
    expect(usingDefaults({ skip: 10 })).toBe(5);
    expect(usingDefaults({ skip: 10, take: 15 })).toBe(15);
  });

  test('set', () => {
    expect(json.set({})).toStrictEqual({});
    expect(json.set({}, '')).toStrictEqual({});
    expect(json.set({}, 'name')).toStrictEqual({});
    expect(json.set({}, 'name', 'Sander')).toStrictEqual({ name: 'Sander' });
    expect(json.set({}, 'name', null)).toStrictEqual({ name: null });
    expect(json.set({}, 'name', { first: 'Sander' })).toStrictEqual({ name: { first: 'Sander' } });
    expect(json.set({ name: { first: 'Sander' } }, 'name', { first: 'Jeroen' })).toStrictEqual({ name: { first: 'Jeroen' } });
    expect(json.set({ name: { first: 'Sander' } }, 'name')).toStrictEqual({});
  });

  test('any', () => {
    const a = any({ name: 'Sander' });
    expect(a.set('name').value).toStrictEqual({});
    expect(a.set('name', 'Sander').value).toStrictEqual({ name: 'Sander' });
    expect(a.set('name', { first: 'Sander' }).value).toStrictEqual({ name: { first: 'Sander' } });
    expect(any({ name: { first: 'Sander' } }).set('name', { first: 'Jeroen' }).value).toStrictEqual({ name: { first: 'Jeroen' } });
    expect(any({ name: { first: 'Sander' } }).set('name').value).toStrictEqual({});
  });

  test('chaining any', () => {
    const opts: PageOptions = { take: 5 };
    const a = any(opts).delete('take').set('take', 42).merge({ skip: 12 }).value;
    expect(a).toMatchObject({ take: 42, skip: 12 });
    expect(a).toMatchJson({ take: 42, skip: 12 });
  });

  test('delete does not fail on undefined', () => {
    expect(json.delete(undefined as unknown as any, 'take')).toBeUndefined();
  });

  test('delete deletes', () => {
    expect(json.delete({ skip: 1, take: 5 }, 'take')).toMatchObject({ skip: 1 });
  });

  test('delete works with non existing key', () => {
    expect(json.delete({ skip: 1, take: 5 }, 'page')).toMatchObject({ skip: 1, take: 5 });
  });

  test('isSubset', () => {
    expect(json.isSubset({ name: 'Sander' }, {})).toBeTruthy();
    expect(json.isSubset({}, { name: 'Sander' })).toBeFalsy();
    expect(json.isSubset({ level: 3 }, { name: 'Sander' })).toBeFalsy();
    expect(json.isSubset({ name: 'Sander' }, { name: 'Sander' })).toBeTruthy();
    expect(json.isSubset({ name: 'Sander' }, { name: 'Jeroen' })).toBeFalsy();
    expect(json.isSubset({ name: 'Sander' }, { name: 'Sander', level: 3 })).toBeFalsy();
    expect(json.isSubset({ name: 'Sander', level: 3 }, { name: 'Sander' })).toBeTruthy();
  });
});
