import { ErrorOrigin, isAn, isError } from '../types';
import { VerbOptions } from './Verb';

export class OriginatedError extends Error {
  constructor(readonly origin: ErrorOrigin, readonly options?: VerbOptions) {
    super();
  }
}

export const isOriginatedError = (e?: unknown): e is OriginatedError => isError(e) && isAn<OriginatedError>(e, 'origin');
