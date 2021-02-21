import { HttpStatus, isHttpStatus } from './HttpStatus';
import { RestResult, toRestResult } from './RestResult';
import { isA } from '../types';

export type Response = {
  status: HttpStatus;
  headers?: { [key: string]: any };
  body: RestResult;
};

export const isResponse = (r?: unknown): r is Response => isA<Response>(r, 'status', 'body');

export const toResponse = (status: HttpStatus | number, body?: unknown, headers?: { [key: string]: any }): Response => ({
  status: isHttpStatus(status) ? status : HttpStatus.byId(status),
  headers,
  body: toRestResult(body),
});
