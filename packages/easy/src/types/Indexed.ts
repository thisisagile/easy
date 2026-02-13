import { isA } from './IsA';

export type Indexed<T> = T & { index: number };

export const isIndexed = <T>(u: unknown): u is Indexed<T> => isA<Indexed<T>>(u, 'index');
