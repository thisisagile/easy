import * as HttpStatus from '../../src/http/HttpStatus';
import { isResponse } from '../../src/http/Response';

describe('Response', () => {
  test('recognizes responses by their required runtime fields', () => {
    expect(isResponse({ status: HttpStatus.Ok, body: { data: { code: 200, items: [], itemCount: 0, totalItems: 0 } } })).toBe(true);
    expect(isResponse({ status: HttpStatus.Ok })).toBe(false);
    expect(isResponse({ body: {} })).toBe(false);
    expect(isResponse()).toBe(false);
  });
});
