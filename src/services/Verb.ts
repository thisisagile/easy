import { HttpVerb } from './HttpVerb';
import { HttpStatus } from './HttpStatus';
import { meta } from '../types';

export type Verb = {verb: HttpVerb, onOk: HttpStatus, onError: HttpStatus};

const verb = <T>(v: Verb): PropertyDecorator =>
  (subject: unknown, property: string): void => { meta(subject).property(property).set('verb', v); };

export const get = (onOk = HttpStatus.Ok, onError = HttpStatus.NotFound): PropertyDecorator =>
  verb({ verb: HttpVerb.Get, onOk, onError });

export const put = (onOk = HttpStatus.Ok, onError = HttpStatus.BadRequest): PropertyDecorator =>
  verb({ verb: HttpVerb.Put, onOk, onError });

export const patch = (onOk = HttpStatus.Ok, onError = HttpStatus.BadRequest): PropertyDecorator =>
  verb({ verb: HttpVerb.Patch, onOk, onError });

export const post = (onOk = HttpStatus.Created, onError = HttpStatus.BadRequest): PropertyDecorator =>
  verb({ verb: HttpVerb.Post, onOk, onError });

export const del = (onOk = HttpStatus.NoContent, onError = HttpStatus.BadRequest): PropertyDecorator =>
  verb({ verb: HttpVerb.Delete, onOk, onError });
