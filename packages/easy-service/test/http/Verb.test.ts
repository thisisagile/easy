import { CacheControl, ContentType, HttpStatus, HttpVerb, meta } from '@thisisagile/easy';
import { DevResource, DevsResource } from '../ref';
import '@thisisagile/easy-test';
import { fits } from '@thisisagile/easy-test';
import { toVerbOptions, Verb } from '../../src';

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

describe('toVerbOptions', () => {
  test('onOk', () => {
    expect(toVerbOptions().onOk).toMatchText(HttpStatus.Ok);
    expect(toVerbOptions({ onOk: HttpStatus.Created }).onOk).toMatchText(HttpStatus.Created);
  });

  test('onError', () => {
    expect(toVerbOptions().onError).toMatchText(HttpStatus.BadRequest);
    expect(toVerbOptions({ onError: HttpStatus.Created }).onError).toMatchText(HttpStatus.Created);
  });

  test('onNotFound', () => {
    expect(toVerbOptions().onNotFound).toMatchText(HttpStatus.NotFound);
    expect(toVerbOptions({ onNotFound: HttpStatus.Created }).onNotFound).toMatchText(HttpStatus.Created);
  });

  test('type', () => {
    expect(toVerbOptions().type).toMatchText(ContentType.Json);
    expect(toVerbOptions({ type: ContentType.Stream }).type).toMatchText(ContentType.Stream);
  });

  test('cache', () => {
    expect(toVerbOptions().cache).toEqual(fits.with({ enabled: false }));
    expect(toVerbOptions({ cache: CacheControl.OneSecond() }).cache).toEqual(fits.with({ enabled: true }));
  });
});
