import { meta } from '../types';
import { ContentType, HttpStatus, HttpVerb } from '../http';

export type VerbOptions = { onOk?: HttpStatus; onNotFound?: HttpStatus; onError?: HttpStatus; type?: ContentType };
export type Verb = { verb: HttpVerb; options: VerbOptions };

const toVerbOptions = (options: VerbOptions): VerbOptions => ({
  onOk: options?.onOk ?? HttpStatus.Ok,
  onNotFound: options?.onNotFound ?? HttpStatus.NotFound,
  onError: options?.onError ?? HttpStatus.BadRequest,
  type: options?.type ?? ContentType.Json,
});

const verb = <T>(verb: HttpVerb, options?: VerbOptions): PropertyDecorator => (subject: unknown, property: string): void => {
  meta(subject)
    .property(property)
    .set('verb', { verb, options: toVerbOptions(options) });
};

export const get = (options?: VerbOptions): PropertyDecorator => verb(HttpVerb.Get, options);
export const search = (options?: VerbOptions): PropertyDecorator =>
  verb(HttpVerb.Get, {
    onNotFound: HttpStatus.Ok,
    ...options,
  });
export const put = (options?: VerbOptions): PropertyDecorator => verb(HttpVerb.Put, options);
export const patch = (options?: VerbOptions): PropertyDecorator => verb(HttpVerb.Patch, options);
export const post = (options?: VerbOptions): PropertyDecorator =>
  verb(HttpVerb.Post, {
    onOk: HttpStatus.Created,
    ...options,
  });
export const del = (options?: VerbOptions): PropertyDecorator =>
  verb(HttpVerb.Delete, {
    onOk: HttpStatus.NoContent,
    ...options,
  });
