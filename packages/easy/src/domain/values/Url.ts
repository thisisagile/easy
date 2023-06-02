import { asString, isEmpty, Value } from '../../types';
import validateUrl from 'validator/lib/isURL';

export interface UrlOptions {
  /**
   * @default ['http','https','ftp']
   */
  protocols?: string[];
  /**
   * @default true
   */
  require_tld?: boolean;
  /**
   * @default false
   */
  require_protocol?: boolean;
  /**
   * @default true
   */
  require_host?: boolean;
  /**
   * if set as true isURL will check if port is present in the URL
   * @default false
   */
  require_port?: boolean;
  /**
   * @default true
   */
  require_valid_protocol?: boolean;
  /**
   * @default false
   */
  allow_underscores?: boolean;
  /**
   * @default false
   */
  host_whitelist?: Array<string | RegExp>;
  /**
   * @default false
   */
  host_blacklist?: Array<string | RegExp>;
  /**
   * @default false
   */
  allow_trailing_dot?: boolean;
  /**
   * @default false
   */
  allow_protocol_relative_urls?: boolean;
  /**
   * @default false
   */
  disallow_auth?: boolean;
}

export class Url extends Value {
  constructor(value: unknown, readonly options?: UrlOptions) {
    super(asString(value));
  }

  get isValid(): boolean {
    return isUrl(this.value, this.options);
  }
}

export const url = (url: unknown, options?: UrlOptions): Url => new Url(url, options);

export const isUrl = (url?: unknown, options?: UrlOptions): boolean => {
  return !isEmpty(url) && validateUrl(asString(url), options);
};
