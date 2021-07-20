import { meta } from '../types';
import { ContentType, HttpStatus, HttpVerb } from './index';

export type VerbOptions = { onOk?: HttpStatus; onNotFound?: HttpStatus; onError?: HttpStatus; type?: ContentType };
export type Verb = { verb: HttpVerb; options: VerbOptions };

export const toVerbOptions = (options?: VerbOptions): Required<VerbOptions> => ({
  onOk: options?.onOk ?? HttpStatus.Ok,
  onNotFound: options?.onNotFound ?? HttpStatus.NotFound,
  onError: options?.onError ?? HttpStatus.BadRequest,
  type: options?.type ?? ContentType.Json,
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
