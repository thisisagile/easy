import { isDefined } from '../types';

export class CacheControl {
  private constructor(private age: number = 1, private stale?: number, readonly enabled = true) {}

  static disabled = () => new CacheControl(0, 0, false);
  static OneSecond = () => new CacheControl().maxAge(1).staleWhileRevalidate(1);
  static fiveSeconds = () => new CacheControl().maxAge(5).staleWhileRevalidate(5);
  static tenSeconds = () => new CacheControl().maxAge(10).staleWhileRevalidate(10);
  static thirtySeconds = () => new CacheControl().maxAge(30).staleWhileRevalidate(30);
  static sixtySeconds = () => new CacheControl().maxAge(60).staleWhileRevalidate(60);
  static custom = (maxAge: number, staleWhileRevalidate?: number) => new CacheControl().maxAge(maxAge).staleWhileRevalidate(staleWhileRevalidate);

  maxAge = (a: number): this => {
    this.age = Math.abs(a);
    return this;
  };

  staleWhileRevalidate = (s?: number): this => {
    this.stale = isDefined(s) ? Math.abs(s) : undefined;
    return this;
  };

  value = (): string => {
    const swr = isDefined(this.stale) ? `, stale-while-revalidate=${this.stale}` : '';
    return this.enabled ? `max-age=${this.age}${swr}` : '';
  };

  name = 'Cache-Control';
}
