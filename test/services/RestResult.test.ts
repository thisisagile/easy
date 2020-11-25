import { isRestResult, toRestResult } from '../../src/services';
import { Dev } from '../ref/Dev';
import { list } from '../../src/types/List';
import { result } from '../../src/types';

const data = { data: { items: [Dev.Wouter.toJSON(), Dev.Naoufal.toJSON(), Dev.Sander.toJSON()], itemCount: 3 } };
const item = Dev.Wouter.toJSON();
const items = list([Dev.Wouter.toJSON(), Dev.Sander.toJSON(), Dev.Jeroen.toJSON()]);
const payload = [{ 'message': 'This is wrong', 'domain': 'easy' }, { 'message': 'Very wrong', 'domain': 'easy' }];
const error = { error: { errors: [{ 'message': 'This is wrong', 'domain': 'easy' }] }};

describe('toRestResult', () => {

  test('From undefined', () => {
    const r = toRestResult();
    expect(isRestResult(r)).toBeTruthy();
    expect(r.data.itemCount).toBe(0);
  });

  test('From empty', () => {
    const r = toRestResult({});
    expect(isRestResult(r)).toBeTruthy();
    expect(r.data.itemCount).toBe(1);
  });

  test('From single primitive', () => {
    const r = toRestResult('Java');
    expect(isRestResult(r)).toBeTruthy();
    expect(r.data.itemCount).toBe(1);
    expect(r.data.items.first()).toBe('Java');
  });

  test('From single item', () => {
    const r = toRestResult(item);
    expect(isRestResult(r)).toBeTruthy();
    expect(r.data.itemCount).toBe(1);
    expect(r.data.items.first()).toMatchObject(item);
  });

  test('From items', () => {
    const r = toRestResult(items);
    expect(isRestResult(r)).toBeTruthy();
    expect(r.data.itemCount).toBe(items.length);
    expect(r.data.items.first()).toMatchObject(items.first());
  });

  test('From data with items', () => {
    const r = toRestResult(data);
    expect(isRestResult(r)).toBeTruthy();
    expect(r.data.itemCount).toBe(data.data.items.length);
    expect(r.data.items.first()).toMatchObject(items.first());
  });

  test('From payload', () => {
    const r = toRestResult(payload);
    expect(isRestResult(r)).toBeTruthy();
    expect(r.data.items.first()).toMatchObject(list(payload).first());
  });

  test('From result', () => {
    const res = result("A good result");
    const r = toRestResult(res);
    expect(isRestResult(r)).toBeTruthy();
    expect(r.error.errors.first()).toMatchObject(res);
  });

  test('From error', () => {
    const r = toRestResult(error);
    expect(isRestResult(r)).toBeTruthy();
    expect(r.error.errorCount).toBe(error.error.errors.length);
    expect(r.error.message).toBe(error.error.errors[0].message);
    expect(r.error.errors.first()).toMatchObject(error.error.errors[0]);
  });
});
