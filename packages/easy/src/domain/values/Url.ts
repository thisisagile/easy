import { asString, isEmpty, Value } from '../../types';
import validator from 'validator';

export interface UrlOptions {
  /**
   * @default ['http','https','ftp']
   */
  protocols?: string[] | undefined;
  /**
   * @default true
   */
  require_tld?: boolean | undefined;
  /**
   * @default false
   */
  require_protocol?: boolean | undefined;
  /**
   * @default true
   */
  require_host?: boolean | undefined;
  /**
   * if set as true isURL will check if port is present in the URL
   * @default false
   */
  require_port?: boolean | undefined;
  /**
   * @default true
   */
  require_valid_protocol?: boolean | undefined;
  /**
   * @default false
   */
  allow_underscores?: boolean | undefined;
  /**
   * @default false
   */
  host_whitelist?: Array<string | RegExp> | undefined;
  /**
   * @default false
   */
  host_blacklist?: Array<string | RegExp> | undefined;
  /**
   * @default false
   */
  allow_trailing_dot?: boolean | undefined;
  /**
   * @default false
   */
  allow_protocol_relative_urls?: boolean | undefined;
  /**
   * @default false
   */
  disallow_auth?: boolean | undefined;
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
  return !isEmpty(url) && validator.isURL(asString(url), options);
};
