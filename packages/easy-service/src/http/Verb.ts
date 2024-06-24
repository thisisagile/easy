import { meta, CacheControl, ContentType, HttpStatus, HttpVerb } from '@thisisagile/easy';

export type VerbOptions = { onOk?: HttpStatus; onNotFound?: HttpStatus; onError?: HttpStatus; type?: ContentType; cache?: CacheControl };
export type Verb = { verb: HttpVerb; options: VerbOptions };

export const toVerbOptions = (options?: VerbOptions): Required<VerbOptions> => ({
  onOk: options?.onOk ?? HttpStatus.Ok,
  onNotFound: options?.onNotFound ?? HttpStatus.NotFound,
  onError: options?.onError ?? HttpStatus.BadRequest,
  type: options?.type ?? ContentType.Json,
  cache: options?.cache ?? CacheControl.disabled(),
});

const toVerb =
  <T>(verb: HttpVerb, options?: VerbOptions): PropertyDecorator =>
  (subject: unknown, property: string | symbol): void => {
    meta(subject).property(property).set('verb', { verb, options });
  };

export const get = (options?: VerbOptions): PropertyDecorator => toVerb(HttpVerb.Get, options);

export const search = (options?: VerbOptions): PropertyDecorator => toVerb(HttpVerb.Get, { onNotFound: HttpStatus.Ok, ...options });

export const put = (options?: VerbOptions): PropertyDecorator => toVerb(HttpVerb.Put, options);

export const patch = (options?: VerbOptions): PropertyDecorator => toVerb(HttpVerb.Patch, options);

export const post = (options?: VerbOptions): PropertyDecorator => toVerb(HttpVerb.Post, { onOk: HttpStatus.Created, ...options });

export const del = (options?: VerbOptions): PropertyDecorator => toVerb(HttpVerb.Delete, { onOk: HttpStatus.NoContent, ...options });

export const stream = (options?: VerbOptions): PropertyDecorator => toVerb(HttpVerb.Get, { type: ContentType.Stream, ...options });
