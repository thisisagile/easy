import { Func } from './Func';
import { CacheAge } from './CacheAge';
import { Construct } from './Constructor';
import { meta } from './Meta';

export interface Store<To = any, From = any> {
  execute: (fetch: From, f: Func<Promise<To>, From>) => Promise<To>;
}

export type CacheOptions = {
  expiresIn?: CacheAge;
  store?: Construct<Store>;
};

export const toCacheOptions = (co: Partial<CacheOptions>): CacheOptions => ({
  expiresIn: co.expiresIn ?? '5m',
  store: co.store,
});

export const cache =
  (options: Partial<CacheOptions>): ClassDecorator =>
  (subject: unknown): void => {
    meta(subject).set('cache', toCacheOptions(options));
  };
