import { get, HttpStatus, HttpVerb, put, Verb } from '../../src/services';
import { meta } from '../../src/utils';

describe('Verb', () => {

  class Resource {
    @get() all = () => '';
    @get(HttpStatus.Ok, HttpStatus.NoContent) byId = () => '';
    @put() go(): string { return ''; }
  }

  test('Verb works on a property', () => {
    const verb: Verb = meta(new Resource()).property('all').get('verb');
    expect(verb.verb).toBe(HttpVerb.Get);
    expect(verb.onOk).toBe(HttpStatus.Ok);
  });

  test('Verb works on a function', () => {
    const verb: Verb = meta(new Resource()).property('go').get('verb');
    expect(verb.verb).toBe(HttpVerb.Put);
  });
});
