import { isEmpty, isEmptyObject, toArray } from '../types';

export const isLoading = (...targets: unknown[]): boolean => toArray(targets).some(t => isEmpty(t) || isEmptyObject(t));
