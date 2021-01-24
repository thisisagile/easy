import { HttpStatus, HttpVerb, meta, Verb } from '../../src';
import { DevResource, DevsResource } from '../ref';

describe('Verb', () => {

  const devs = meta(new DevsResource());
  const dev = meta(new DevResource());

  test('Verb works on a property', () => {
    const verb: Verb = devs.property('all').get('verb');
    expect(verb.verb).toBe(HttpVerb.Get);
  });

  test('Verb works on a function', () => {
    const verb: Verb = dev.property('update').get('verb');
    expect(verb.verb).toBe(HttpVerb.Put);
  });

  test('Get all verb decorated properties', () => {
    const verbs = devs.keys<Verb>('verb');
    expect(verbs).toHaveLength(4);
  });

  test('Get all verb options', () => {
    const verb: Verb = dev.property('byId').get('verb');
    expect(verb.options.onOk).toBe(HttpStatus.Ok);
    expect(verb.options.onNotFound).toBe(HttpStatus.NotFound);
    expect(verb.options.onError).toBe(HttpStatus.BadRequest);
  })

  test('Get all verb options when overridden by verb', () => {
    const verb: Verb = devs.property('all').get('verb');
    expect(verb.options.onOk).toBe(HttpStatus.Ok);
    expect(verb.options.onNotFound).toBe(HttpStatus.Ok);
    expect(verb.options.onError).toBe(HttpStatus.BadRequest);
  })

  test('Get all verb options when overridden in method', () => {
    const verb: Verb = devs.property('del').get('verb');
    expect(verb.options.onOk).toBe(HttpStatus.BadGateway);
    expect(verb.options.onNotFound).toBe(HttpStatus.Ok);
    expect(verb.options.onError).toBe(HttpStatus.BadRequest);
  })
});
