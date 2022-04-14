import { ContentType, ctx, HttpHeader, RequestOptions } from '../../src';

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
