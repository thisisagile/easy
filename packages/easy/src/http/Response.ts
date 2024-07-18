import { HttpStatus } from './HttpStatus';
import type { RestResult } from './RestResult';
import { isA } from '../types/IsA';
import { TypeGuard } from '../types/TypeGuard';

export type Response = {
  status: HttpStatus;
  headers?: { [key: string]: any };
  body: RestResult;
};

export const isResponse: TypeGuard<Response> = (r?: unknown): r is Response => isA<Response>(r, 'status', 'body');
