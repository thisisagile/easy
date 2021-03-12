import { HttpStatus } from '../http';
import { isError } from '../types';

export class AuthError extends Error {
  status: number;

  constructor({ name, status }: HttpStatus) {
    super(name);
    this.name = 'AuthenticationError';
    this.status = status;
  }
}

export const authError = (status: HttpStatus): AuthError => new AuthError(status);

export const isAuthError = (e?: unknown): boolean => isError(e) && e.name === 'AuthenticationError';
