import { toArray, toObject } from '../../src';
import { Dev } from '../ref';

describe('toArray', () => {
  test('from nothing', () => {
    expect(toArray()).toHaveLength(0);
  });

  test('from undefined', () => {
    expect(toArray(undefined)).toHaveLength(0);
  });

  test('from null', () => {
    expect(toArray(null)).toHaveLength(0);
  });

  test('from single item', () => {
    expect(toArray(Dev.Sander)).toHaveLength(1);
  });

  test('from two items', () => {
    expect(toArray(Dev.Sander, Dev.Jeroen)).toHaveLength(2);
  });

  test('from array of two items', () => {
    expect(toArray([Dev.Sander, Dev.Jeroen])).toHaveLength(2);
  });

  test('from spread of two items', () => {
    const spread = [Dev.Sander, Dev.Jeroen];
    expect(toArray(...spread)).toHaveLength(2);
  });
});

describe('toObject', () => {
  test('from undefined works', () => {
    const res = toObject('id');
    expect(res).toStrictEqual({});
  });

  test('from single object works', () => {
    const res = toObject('id', Dev.Naoufal);
    expect(res[Dev.Naoufal.id]).toStrictEqual(Dev.Naoufal);
  });

  test('from a series of objects works', () => {
    const res = toObject('id', Dev.Naoufal, Dev.Jeroen, Dev.Wouter);
    expect(res).toStrictEqual({
      [Dev.Naoufal.id]: Dev.Naoufal,
      [Dev.Wouter.id]: Dev.Wouter,
      [Dev.Jeroen.id]: Dev.Jeroen,
    });
  });

  test('from a list of objects works', () => {
    const res = toObject('id', Dev.All);
    expect(res).toStrictEqual({
      [Dev.Naoufal.id]: Dev.Naoufal,
      [Dev.Wouter.id]: Dev.Wouter,
      [Dev.Sander.id]: Dev.Sander,
      [Dev.Jeroen.id]: Dev.Jeroen,
    });
  });
});
