import { isNotPresent } from '../types';

export const isLoading = (...targets: unknown[]): boolean => isNotPresent(...targets);
