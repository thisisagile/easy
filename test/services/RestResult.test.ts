import { HttpStatus, isRestResult, list, results, toRestResult, toResult, Response, RestResult } from '../../src';
import { Dev } from '../ref';

const data = {
  data: {
    code: HttpStatus.Created.status,
    items: [Dev.Wouter.toJSON(), Dev.Naoufal.toJSON(), Dev.Sander.toJSON()],
    itemCount: 3,
  },
};
const item = Dev.Wouter.toJSON();
const items = list([Dev.Wouter.toJSON(), Dev.Sander.toJSON(), Dev.Jeroen.toJSON()]);
const payload = [
  { message: 'This is wrong', domain: 'easy' },
  { message: 'Very wrong', domain: 'easy' },
];
const error = { error: { code: HttpStatus.BadGateway.status, message: '', errors: [{ message: 'This is wrong', domain: 'easy' }], errorCount: 1 } };

describe('toRestResult', () => {
  test('From undefined', () => {
    const r = toRestResult();
    expect(r).toBeUndefined();
  });

  test('From empty', () => {
    const r = toRestResult({});
    expect(isRestResult(r)).toBeTruthy();
    expect(r.data.code).toBe(HttpStatus.Ok.status);
    expect(r.data.itemCount).toBe(1);
  });

  test('From single primitive', () => {
    const r = toRestResult('Java');
    expect(isRestResult(r)).toBeTruthy();
    expect(r.data.code).toBe(HttpStatus.Ok.status);
    expect(r.data.itemCount).toBe(1);
    expect(r.data.items.first()).toBe('Java');
  });

  test('From single item', () => {
    const r = toRestResult(item);
    expect(isRestResult(r)).toBeTruthy();
    expect(r.data.code).toBe(HttpStatus.Ok.status);
    expect(r.data.itemCount).toBe(1);
    expect(r.data.items.first()).toMatchObject(item);
  });

  test('From items', () => {
    const r = toRestResult(items);
    expect(isRestResult(r)).toBeTruthy();
    expect(r.data.code).toBe(HttpStatus.Ok.status);
    expect(r.data.itemCount).toBe(items.length);
    expect(r.data.items.first()).toMatchObject(items.first());
  });

  test('From items and status', () => {
    const r = toRestResult(items, HttpStatus.Created);
    expect(r.data.code).toBe(HttpStatus.Created.status);
    expect(r.data.itemCount).toBe(items.length);
    expect(r.data.items.first()).toMatchObject(items.first());
  });

  test('From data with items', () => {
    const r = toRestResult(data);
    expect(isRestResult(r)).toBeTruthy();
    expect(r.data.code).toBe(data.data.code);
    expect(r.data.itemCount).toBe(data.data.items.length);
    expect(r.data.items.first()).toMatchObject(items.first());
  });

  test('From data without code', () => {
    const r = toRestResult({ data: { ...data.data, code: undefined } });
    expect(isRestResult(r)).toBeTruthy();
    expect(r.data.code).toBe(HttpStatus.Ok.status);
  });

  test('From payload', () => {
    const r = toRestResult(payload);
    expect(isRestResult(r)).toBeTruthy();
    expect(r.data.code).toBe(HttpStatus.Ok.status);
    expect(r.data.items.first()).toMatchObject(list(payload).first());
  });

  test('From result', () => {
    const res = toResult('A good result');
    const r = toRestResult(res);
    expect(r.error.code).toBe(HttpStatus.BadRequest.status);
    expect(isRestResult(r)).toBeTruthy();
    expect(r.error.errors.first()).toMatchObject(res);
  });

  test('From errorResponse', () => {
    const r = toRestResult(error);
    expect(isRestResult(r)).toBeTruthy();
    expect(r.error.code).toBe(error.error.code);
    expect(r.error.errorCount).toBe(error.error.errors.length);
    expect(r.error.message).toBe(error.error.errors[0].message);
    expect(r.error.errors.first()).toMatchObject(error.error.errors[0]);
  });

  test('From errorResponse without code', () => {
    const r = toRestResult({ error: { ...error.error, code: undefined } });
    expect(isRestResult(r)).toBeTruthy();
    expect(r.error.code).toBe(HttpStatus.BadRequest.status);
  });

  test('From results', () => {
    const res = results('A good result');
    const r = toRestResult(res, HttpStatus.BadGateway);
    expect(isRestResult(r)).toBeTruthy();
    expect(r.error.code).toBe(HttpStatus.BadGateway.status);
    expect(r.error.errors.first()).toMatchObject(res.results[0]);
  });

  test('From Error', () => {
    const res = new Error('Error');
    const r = toRestResult(res);
    expect(isRestResult(r)).toBeTruthy();
    expect(r.error.code).toBe(HttpStatus.BadRequest.status);
    expect(r.error.errors.first()).toMatchObject(res);
  });

  test('From Response', () => {
    const res: Response = { status: HttpStatus.InternalServerError, body: error as RestResult };
    const r = toRestResult(res);
    expect(isRestResult(r)).toBeTruthy();
    expect(r.error.code).toBe(error.error.code);
    expect(r.error.errors.first()).toMatchObject(error.error.errors[0]);
  });
});
