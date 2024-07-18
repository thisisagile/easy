import { isNotPresent } from '../types/Is';

export const isLoading = (...targets: unknown[]): boolean => isNotPresent(...targets);
