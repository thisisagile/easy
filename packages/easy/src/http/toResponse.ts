import * as HttpStatus from './HttpStatus';
import { rest } from './RestResult';
import { Response } from './Response';
import { Code } from '../types/Id';

export function toResponse(status: HttpStatus.Enum | Code, body?: unknown, headers?: { [key: string]: any }): Response {
  return {
    status: HttpStatus.toHttpStatus(status),
    headers,
    body: rest.to(body),
  };
}
