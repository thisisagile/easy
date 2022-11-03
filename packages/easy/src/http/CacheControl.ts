import { isDefined } from '../types';
import {cacheAge, CacheAge} from "./CacheAge";

export class CacheControl {
  protected constructor(readonly enabled = true) {}

  protected _maxAge?: number;
  protected _sharedMaxAge?: number;
  protected _noCache?: boolean;
  protected _mustRevalidate?: boolean;
  protected _private?: boolean;
  protected _public?: boolean;
  protected _immutable?: boolean;
  protected _staleWhileRevalidate?: number;

  static disabled = () => new CacheControl(false);
  static OneSecond = () => new CacheControl().maxAge(1).staleWhileRevalidate(1);
  static fiveSeconds = () => new CacheControl().maxAge(5).staleWhileRevalidate(5);
  static tenSeconds = () => new CacheControl().maxAge(10).staleWhileRevalidate(10);
  static thirtySeconds = () => new CacheControl().maxAge(30).staleWhileRevalidate(30);
  static sixtySeconds = () => new CacheControl().maxAge(60).staleWhileRevalidate(60);
  static custom = (maxAge?: CacheAge, staleWhileRevalidate?: number) => new CacheControl().maxAge(maxAge).staleWhileRevalidate(staleWhileRevalidate);

  readonly maxAge = (ca?: CacheAge): this => {
    this._maxAge = ca ? cacheAge.toSeconds(ca) : ca;
    return this;
  };

  readonly sharedMaxAge = (a?: number): this => {
    this._sharedMaxAge = a;
    return this;
  };

  readonly noCache = (a?: boolean): this => {
    this._noCache = a;
    return this;
  };

  readonly mustRevalidate = (a?: boolean): this => {
    this._mustRevalidate = a;
    return this;
  };

  readonly private = (a?: boolean): this => {
    this._private = a;
    return this;
  };

  readonly public = (a?: boolean): this => {
    this._public = a;
    return this;
  };

  readonly immutable = (a?: boolean): this => {
    this._immutable = a;
    return this;
  };

  readonly staleWhileRevalidate = (a?: number): this => {
    this._staleWhileRevalidate = a;
    return this;
  };

  value = (): string => {
    const directives: string[] = [];
    isDefined(this._maxAge) && directives.push(`max-age=${this._maxAge}`);
    isDefined(this._sharedMaxAge) && directives.push(`s-maxage=${this._sharedMaxAge}`);
    this._noCache === true && directives.push(`no-cache`);
    this._mustRevalidate === true && directives.push(`must-revalidate`);
    this._private === true && directives.push(`private`);
    this._public === true && directives.push(`public`);
    this._immutable === true && directives.push(`immutable`);
    isDefined(this._staleWhileRevalidate) && directives.push(`stale-while-revalidate=${this._staleWhileRevalidate}`);
    return directives.join(',');
  };

  name = 'Cache-Control';
}
