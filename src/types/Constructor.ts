import { Get } from './Get';

export type Constructor<T = unknown> = { new (...args: any[]): T };

export type Construct<T> = Get<T> | Constructor<T>;

export const toName = (subject?: unknown, postfix = ''): string => (subject as any)?.constructor?.name?.replace(postfix, '').toLowerCase() ?? '';
