import { HttpVerb } from './HttpVerb';
import { HttpStatus } from './HttpStatus';
import { meta } from '../types';

export type VerbOptions = { onOk: HttpStatus; onNotFound: HttpStatus; onError: HttpStatus };
export type Verb = { verb: HttpVerb; options: VerbOptions };

const toVerbOptions = (options: VerbOptions): VerbOptions => ({
  onOk: options?.onOk ?? HttpStatus.Ok,
  onNotFound: options?.onNotFound ?? HttpStatus.NotFound,
  onError: options?.onError ?? HttpStatus.BadRequest,
});

const verb = <T>(verb: HttpVerb, options?: VerbOptions): PropertyDecorator => (subject: unknown, property: string): void => {
  meta(subject)
    .property(property)
    .set('verb', { verb, options: toVerbOptions(options) });
};

export const get = (options?: VerbOptions): PropertyDecorator => verb(HttpVerb.Get, options);
export const find = (options?: VerbOptions): PropertyDecorator => verb(HttpVerb.Get, {
  ...options,
  onNotFound: HttpStatus.Ok,
});
export const put = (options?: VerbOptions): PropertyDecorator => verb(HttpVerb.Put, options);
export const patch = (options?: VerbOptions): PropertyDecorator => verb(HttpVerb.Patch, options);
export const post = (options?: VerbOptions): PropertyDecorator =>
  verb(HttpVerb.Post, {
    ...options,
    onOk: HttpStatus.Created,
  });
export const del = (options?: VerbOptions): PropertyDecorator =>
  verb(HttpVerb.Delete, {
    ...options,
    onOk: HttpStatus.NoContent,
  });
