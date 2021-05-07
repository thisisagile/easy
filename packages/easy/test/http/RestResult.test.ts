import { HttpStatus, isRestResult, Response, rest, RestResult, toList, toResult, toResults } from '../../src';
import { Dev } from '../ref';

const data = {
  data: {
    code: HttpStatus.Created.status,
    items: [Dev.Wouter.toJSON(), Dev.Naoufal.toJSON(), Dev.Sander.toJSON()],
    itemCount: 3,
  },
};
const item = Dev.Wouter.toJSON();
const items = toList([Dev.Wouter.toJSON(), Dev.Sander.toJSON(), Dev.Jeroen.toJSON()]);
const payload = [
  { message: 'This is wrong', domain: 'easy' },
  { message: 'Very wrong', domain: 'easy' },
];
const error = { error: { code: HttpStatus.BadGateway.status, message: '', errors: [{ message: 'This is wrong', domain: 'easy' }], errorCount: 1 } };

describe('rest.to', () => {
  test('From undefined', () => {
    const r = rest.to();
    expect(r).toBeUndefined();
  });

  test('From empty', () => {
    const r = rest.to({});
    expect(isRestResult(r)).toBeTruthy();
    expect(r.data?.code).toBe(HttpStatus.Ok.status);
    expect(r.data?.itemCount).toBe(1);
  });

  test('From single primitive', () => {
    const r = rest.to('Java');
    expect(isRestResult(r)).toBeTruthy();
    expect(r.data?.code).toBe(HttpStatus.Ok.status);
    expect(r.data?.itemCount).toBe(1);
    expect(r.data?.items.first()).toBe('Java');
  });

  test('From single item', () => {
    const r = rest.to(item);
    expect(isRestResult(r)).toBeTruthy();
    expect(r.data?.code).toBe(HttpStatus.Ok.status);
    expect(r.data?.itemCount).toBe(1);
    expect(r.data?.items.first()).toMatchObject(item);
  });

  test('From items', () => {
    const r = rest.to(items);
    expect(isRestResult(r)).toBeTruthy();
    expect(r.data?.code).toBe(HttpStatus.Ok.status);
    expect(r.data?.itemCount).toBe(items.length);
    expect(r.data?.items.first()).toMatchObject(items.first());
  });

  test('From items and status', () => {
    const r = rest.to(items, HttpStatus.Created);
    expect(r.data?.code).toBe(HttpStatus.Created.status);
    expect(r.data?.itemCount).toBe(items.length);
    expect(r.data?.items.first()).toMatchObject(items.first());
  });

  test('From data with items', () => {
    const r = rest.to(data);
    expect(isRestResult(r)).toBeTruthy();
    expect(r.data?.code).toBe(data.data.code);
    expect(r.data?.itemCount).toBe(data.data.items.length);
    expect(r.data?.items.first()).toMatchObject(items.first());
  });

  test('From data without code', () => {
    const r = rest.to({ data: { ...data.data, code: undefined } });
    expect(isRestResult(r)).toBeTruthy();
    expect(r.data?.code).toBe(HttpStatus.Ok.status);
  });

  test('From payload', () => {
    const r = rest.to(payload);
    expect(isRestResult(r)).toBeTruthy();
    expect(r.data?.code).toBe(HttpStatus.Ok.status);
    expect(r.data?.items.first()).toMatchObject(toList(payload).first());
  });

  test('From result', () => {
    const res = toResult('A good result');
    const r = rest.to(res);
    expect(r.error?.code).toBe(HttpStatus.BadRequest.status);
    expect(isRestResult(r)).toBeTruthy();
    expect(r.error?.errors.first()).toMatchObject(res);
  });

  test('From status', () => {
    const r = rest.to(HttpStatus.Conflict);
    expect(r.error?.code).toBe(HttpStatus.Conflict.status);
    expect(r.error?.errorCount).toBe(1);
    expect(r.error?.errors.first()).toMatchObject({ message: HttpStatus.Conflict.name });
  });

  test('From errorResponse', () => {
    const r = rest.to(error);
    expect(isRestResult(r)).toBeTruthy();
    expect(r.error?.code).toBe(error.error.code);
    expect(r.error?.errorCount).toBe(error.error.errors.length);
    expect(r.error?.message).toBe(HttpStatus.BadGateway.name);
    expect(r.error?.errors.first()).toMatchObject(error.error.errors[0]);
  });

  test('From errorResponse without code', () => {
    const r = rest.to({ error: { ...error.error, code: undefined } });
    expect(isRestResult(r)).toBeTruthy();
    expect(r.error?.code).toBe(HttpStatus.BadRequest.status);
  });

  test('From results', () => {
    const res = toResults('A good result');
    const r = rest.to(res, HttpStatus.BadGateway);
    expect(isRestResult(r)).toBeTruthy();
    expect(r.error?.code).toBe(HttpStatus.BadGateway.status);
    expect(r.error?.errors.first()).toMatchObject(res.results[0]);
  });

  test('From Error', () => {
    const res = new Error('Error');
    const r = rest.to(res);
    expect(isRestResult(r)).toBeTruthy();
    expect(r.error?.code).toBe(HttpStatus.BadRequest.status);
    expect(r.error?.errors.first()).toMatchObject(res);
  });

  test('From Response', () => {
    const res: Response = { status: HttpStatus.InternalServerError, body: error as RestResult };
    const r = rest.to(res);
    expect(isRestResult(r)).toBeTruthy();
    expect(r.error?.code).toBe(error.error.code);
    expect(r.error?.errors.first()).toMatchObject(error.error.errors[0]);
  });
});
