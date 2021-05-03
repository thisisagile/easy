import { isJson, json, toJson } from '../../src';
import { Dev, DevsResource } from '../ref';

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
    expect(isJson(new DevsResource())).toBeFalsy();
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

describe('json', () => {
  const dev = { id: 2, name: 'Naoufal', level: 3, language: 'TypeScript' };

  test('omit undefined should return what?', () => {
    const empty = json.omit(undefined, 'language');
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
});
