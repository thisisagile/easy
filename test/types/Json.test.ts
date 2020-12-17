import { isJson, jsonify, toJson } from '../../src';
import { Dev, DevsResource } from '../ref';

describe('jsonify', () => {
  test('jsonify nothing', () => {
    const json = jsonify();
    expect(json).toMatchObject({});
  });

  test('jsonify empty', () => {
    const json = jsonify({});
    expect(json).toMatchObject({});
  });

  test('jsonify undefined', () => {
    const json = jsonify(undefined);
    expect(json).toMatchObject({});
  });

  test('jsonify null', () => {
    const json = jsonify(null);
    expect(json).toMatchObject({});
  });

  test('jsonify simple', () => {
    const json = jsonify({ name: 'Sander' });
    expect(json).toMatchObject({ name: 'Sander' });
  });

  test('jsonify entity', () => {
    const json = jsonify(Dev.Wouter);
    expect(json).toMatchObject({ name: 'Wouter', language: 'TypeScript', level: 3 });
  });

  test('jsonify removes undefined', () => {
    const json = jsonify({ name: 'Wouter', language: 'TypeScript', level: undefined });
    expect(json?.level).toBeUndefined();
  });

  test('jsonify removes undefined and adds', () => {
    const json = jsonify({ name: 'Wouter', language: 'TypeScript' });
    expect(json).toMatchObject({ name: 'Wouter', language: 'TypeScript' });
  });

  test('jsonify object and adds', () => {
    const json = jsonify(Dev.Wouter);
    expect(json).toMatchObject({ name: 'Wouter', language: 'TypeScript', level: 3 });
  });
});

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
    const json = toJson(Dev.Wouter, Dev.Naoufal);
    expect(json).toMatchObject({ id: 2, name: 'Naoufal', language: 'TypeScript', level: 3 });
  });

  test('update works', () => {
    const dev = Dev.Sander.update({ level: 2 });
    expect(dev).toMatchObject({ name: 'Sander', level: 2 });
  });
});
