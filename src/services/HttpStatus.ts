import { Enum, isAn } from '../types';

export class HttpStatus extends Enum {
  static Ok = new HttpStatus('Ok', 200);
  static Created = new HttpStatus('Created', 201);
  static NoContent = new HttpStatus('No content', 204);
  static BadRequest = new HttpStatus('Bad request', 400);
  static NotAuthorized = new HttpStatus('Not authorized', 401);
  static Forbidden = new HttpStatus('Forbidden', 403);
  static NotFound = new HttpStatus('Not found', 404);
  static Conflict = new HttpStatus('Conflict', 409);
  static InternalServerError = new HttpStatus('Internal server error', 500);
  static NotImplemented = new HttpStatus('Not implemented', 501);
  static BadGateway = new HttpStatus('Bad gateway', 502);
  static ServiceUnavailable = new HttpStatus('Service unavailable', 503);

  get isError(): boolean {
    return this.id >= 400;
  }

  get status(): number {
    return this.id as number;
  }
}

export const isHttpStatus = (s?: unknown): s is HttpStatus => isAn<HttpStatus>(s, 'id', 'status');
