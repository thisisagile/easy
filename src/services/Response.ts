import { HttpStatus } from './HttpStatus';
import { RestResult, toRestResult } from './RestResult';
import { isA } from '../types';

export type Response = {
  status: HttpStatus;
  headers?: { [key: string]: any };
  body: RestResult;
};

export const isResponse = (r?: unknown): r is Response => isA<Response>(r, 'status', 'body');

export const toResponse = (status: number, headers?: { [key: string]: any }, body?: unknown): Response => ({
  status: HttpStatus.byId(status),
  headers,
  body: toRestResult(body),
});
