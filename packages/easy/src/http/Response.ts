import { HttpStatus, toHttpStatus } from './HttpStatus';
import { rest, RestResult } from './RestResult';
import { Code, isA, TypeGuard } from '../types';

export type Response = {
  status: HttpStatus;
  headers?: { [key: string]: any };
  body: RestResult;
};

export const isResponse: TypeGuard<Response> = (r?: unknown): r is Response => isA<Response>(r, 'status', 'body');

export const toResponse = (status: HttpStatus | Code, body?: unknown, headers?: { [key: string]: any }): Response => ({
  status: toHttpStatus(status),
  headers,
  body: rest.to(body),
});
