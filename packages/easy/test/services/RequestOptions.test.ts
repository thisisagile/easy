import { ContentType, ctx, HttpHeader, HttpStatus, isRequestOptions, RequestOptions } from '../../src';
import { Dev } from '../ref';

describe('RequestOptions', () => {
  let options: RequestOptions;

  beforeEach(() => {
    options = new RequestOptions();
  });

  test('constructor', () => {
    jest.spyOn(ctx.request, 'correlationId', 'get').mockReturnValue('4');
    const ro = new RequestOptions(ContentType.Xml, { foo: 'bar' });
    expect(ro.type).toBe(ContentType.Xml);
    expect(ro.headers.foo).toBe('bar');
    expect(ro.headers[HttpHeader.Correlation]).toBe('4');
  });

  test('type matches.', () => {
    expect(options.type).toBe(ContentType.Json);
    expect(RequestOptions.Json.type).toBe(ContentType.Json);
    expect(RequestOptions.Xml.type).toBe(ContentType.Xml);
    expect(RequestOptions.Text.type).toBe(ContentType.Text);
    expect(RequestOptions.Form.type).toBe(ContentType.Form);
  });

  test('accept().', () => {
    expect(options.accept(ContentType.Json).type).toBe(ContentType.Json);
  });

  test('Accept header is undefined by default.', () => {
    expect(options.headers['Accept']).toBeUndefined();
  });

  test('Accept header is set.', () => {
    options.accept(ContentType.Xml);
    expect(options.type).toBe(ContentType.Json);
    expect(options.headers['Accept']).toBe(ContentType.Xml.id);
  });

  test('apiKey()', () => {
    const k = '12324';
    expect(RequestOptions.Json.apiKey(k).headers.apiKey).toBe(k);
  });

  test('set header', () => {
    const opts = RequestOptions.Json;
    expect(opts.setHeader('api', '').headers['api']).toBe('');
    expect(opts.setHeader('api', 'value').headers['api']).toBe('value');
    expect(opts.setHeader('api', true).headers['api']).toBe(true);
    expect(opts.setHeader('api', false).headers['api']).toBe(false);
    expect(opts.setHeader('api', 123).headers['api']).toBe(123);
    expect(opts.setHeader('Api', 42).headers['Api']).toBe(42);
    expect(opts.setHeader(HttpStatus.Ok, 42).headers['200']).toBe(42);
  });

  test('set header unless present with undefined value', () => {
    const opts = RequestOptions.Json;
    expect(opts.setHeaderUnlessPresent('api').headers['api']).toBeUndefined();
  });

  test('setHeaderUnlessPresent dont overwrite existing head set header', () => {
    const opts = RequestOptions.Json;
    opts.headers['api'] = 'present';
    expect(opts.setHeaderUnlessPresent('api', 'new value').headers['api']).toBe('present');
  });

  test('setHeaderUnlessPresent set header', () => {
    const opts = RequestOptions.Json;
    expect(opts.setHeaderUnlessPresent('api', 'new value').headers['api']).toBe('new value');
  });

  test('bearer()', () => {
    const jwt = '12324';
    const options = RequestOptions.Json.bearer(jwt);
    expect(options.headers.Authorization).toBe(`Bearer ${jwt}`);
  });

  test('basic()', () => {
    const options = RequestOptions.Json.basic('username', 'password');
    expect(options.headers.Authorization).toBe(`Basic dXNlcm5hbWU6cGFzc3dvcmQ=`);
  });

  test('authorization())', () => {
    options.authorization('Hello');
    expect(options.headers.Authorization).toBe('Hello');
  });
});

describe('isRequestOptions', () => {
  test('is and is not', () => {
    expect(isRequestOptions()).toBeFalsy();
    expect(isRequestOptions({})).toBeFalsy();
    expect(isRequestOptions(Dev.Jeroen)).toBeFalsy();
    expect(isRequestOptions(RequestOptions.Json)).toBeTruthy();
  });
});
