import { HttpStatus, toHttpStatus } from './HttpStatus';
import { rest } from './RestResult';
import { Response } from './Response';
import { Code } from '../types/Id';

export function toResponse(status: HttpStatus | Code, body?: unknown, headers?: { [key: string]: any }): Response {
  return {
    status: toHttpStatus(status),
    headers,
    body: rest.to(body),
  };
}
