import { ErrorOrigin, isError } from '../types';
import { VerbOptions } from './Verb';

export class OriginatedError extends Error {
  constructor(readonly origin: ErrorOrigin, readonly options?: VerbOptions) {
    super();
  }
}

export const isOriginatedError = (e?: unknown): e is OriginatedError => isError(e) && e instanceof OriginatedError;

export const toOriginatedError = (e: unknown, options?: VerbOptions): OriginatedError =>
  isOriginatedError(e) ? e : new OriginatedError(e as ErrorOrigin, options);
