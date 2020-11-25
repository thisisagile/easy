import { RequestOptions } from '../../src/services/RequestOptions';
import { ContentType } from '../../src/services';

describe('RequestOptions', () => {

  let options: RequestOptions;

  beforeEach(() => {
    options = new RequestOptions();
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

  test('bearer()', () => {
    const jwt = '12324';
    const options = RequestOptions.Json.bearer(jwt);
    expect(options.headers.Authorization).toBe(`Bearer ${jwt}`);
  });

  test('authorization())', () => {
    options.authorization('Hello');
    expect(options.headers.Authorization).toBe('Hello');
    options.bearer(undefined);
    expect(options.headers.Authorization).toBe('Hello');
  });
});
