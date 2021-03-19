import { HttpStatus, isResponse, toJson, toResponse } from '../../src';
import { Json } from '../../dist';

const responseWith = (httpStatus: HttpStatus, body?: any, headers?: any): Json =>
  (toJson({
    body: body ? {
      data: {
        code: httpStatus.status,
        itemCount: 1,
        items: [body],
      },
    } : undefined,
    headers: headers,
    status: httpStatus,
  }));

describe('Testing Response', () => {

  test('isResponse', () => {
    expect(isResponse({})).toBeFalsy();
    expect(isResponse({ status: 123 })).toBeFalsy();
    expect(isResponse({ body: {} })).toBeFalsy();
    expect(isResponse({ status: 123, body: {} })).toBeTruthy();
  });

  test('toResponse', () => {
    const headers = { 'Content-Type': 'application/json' };
    const body = { foo: 'bar' };
    const status = HttpStatus.Created;
    expect(toJson(toResponse(HttpStatus.Created, body, headers))).toEqual(responseWith(status, body, headers));
    expect(toJson(toResponse(HttpStatus.Created))).toEqual(responseWith(status));
    expect(toJson(toResponse(HttpStatus.Created, undefined, headers))).toEqual(responseWith(status, undefined, headers));
  });

});    