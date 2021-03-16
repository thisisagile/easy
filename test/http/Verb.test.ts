import { ContentType, HttpStatus, HttpVerb, meta, Verb } from '../../src';
import { DevResource, DevsResource } from '../ref';

describe('Verb', () => {
  const devs = meta(new DevsResource());
  const dev = meta(new DevResource());

  test('Verb works on a property', () => {
    const verb: Verb | undefined = devs.property('all').get('verb');
    expect(verb?.verb).toBe(HttpVerb.Get);
  });

  test('Verb works on a function', () => {
    const verb: Verb | undefined = dev.property('update').get('verb');
    expect(verb?.verb).toBe(HttpVerb.Put);
  });

  test('Get all verb decorated properties', () => {
    const verbs = dev.keys<Verb>('verb');
    expect(verbs).toHaveLength(5);
  });

  test('Get all verb options', () => {
    const verb: Verb | undefined = dev.property('byId').get('verb');
    expect(verb?.options).toBeUndefined();
  });

  test('Get all verb options when overridden by verb', () => {
    const verb: Verb | undefined = devs.property('all').get('verb');
    expect(verb?.options.onOk).toBe(HttpStatus.NoContent);
    expect(verb?.options.onNotFound).toBe(HttpStatus.Ok);
    expect(verb?.options.onError).toBeUndefined();
  });

  test('Get all verb options when overridden in method', () => {
    const verb: Verb | undefined = dev.property('delete').get('verb');
    expect(verb?.options.onOk).toBe(HttpStatus.BadGateway);
    expect(verb?.options.onNotFound).toBeUndefined();
    expect(verb?.options.onError).toBeUndefined();
    expect(verb?.options.type).toBe(ContentType.Stream);
  });

  test('Get content type when using stream', () => {
    const verb: Verb | undefined = dev.property('pdf').get('verb');
    expect(verb?.options.type).toBe(ContentType.Stream);
  });
});
