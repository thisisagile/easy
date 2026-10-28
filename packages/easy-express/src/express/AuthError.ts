import type { Enum as HttpStatus } from '@thisisagile/easy/HttpStatus';
import { isError } from '@thisisagile/easy';

export class AuthError extends Error {
  status: number;

  constructor({ name, status }: HttpStatus) {
    super(name);
    this.name = 'AuthenticationError';
    this.status = status;
  }
}

export const authError = (status: HttpStatus): AuthError => new AuthError(status);

export const isAuthError = (e?: unknown): e is AuthError => isError(e) && e.name === 'AuthenticationError';
