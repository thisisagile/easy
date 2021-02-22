import { HttpStatus } from '../http';
import { isError } from '../types';

export const authError = ({ name, status }: HttpStatus): Error & { status: number } => ({
  ...Error(),
  name: 'AuthenticationError',
  message: name,
  status,
});

export const isAuthError = (e?: unknown): boolean => isError(e) && e.name === 'AuthenticationError';
