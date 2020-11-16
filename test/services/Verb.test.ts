import { HttpStatus, HttpVerb, Verb } from '../../src/services';
import { DevResource, DevsResource } from '../ref/DevResource';
import { meta } from '../../src/types';

describe('Verb', () => {

  test('Verb works on a property', () => {
    const verb: Verb = meta(new DevsResource()).property('all').get('verb');
    expect(verb.verb).toBe(HttpVerb.Get);
    expect(verb.onOk).toBe(HttpStatus.Ok);
  });

  test('Verb works on a function', () => {
    const verb: Verb = meta(new DevResource()).property('update').get('verb');
    expect(verb.verb).toBe(HttpVerb.Put);
  });

  test('Get all verb decorated properties', () => {
    const verbs = meta(new DevResource()).keys<Verb>('verb');
    expect(verbs.length).toBe(4);
  });
});
