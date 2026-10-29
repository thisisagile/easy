import * as HttpVerb from '../../src/http/HttpVerb';

describe('HttpVerb', () => {
  test('exposes values with HTTP method codes', () => {
    expect(HttpVerb.Get).toBeInstanceOf(HttpVerb.Enum);
    expect(HttpVerb.Get.id).toBe('get');
    expect(HttpVerb.Get.code).toBe('GET');
    expect(HttpVerb.Delete.code).toBe('DELETE');
  });

  test('creates custom verbs through the catalogue API', () => {
    const verb: HttpVerb.Enum = HttpVerb.create('Propfind');

    expect(verb).toBeInstanceOf(HttpVerb.Enum);
    expect(verb.code).toBe('PROPFIND');
  });

  test('queries the explicit catalogue', () => {
    expect(HttpVerb.byId('post')).toBe(HttpVerb.Post);
    expect(HttpVerb.byIds(['get', 'missing', 'get'])).toEqual([HttpVerb.Get]);
  });
});
