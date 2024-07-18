import { HttpHeader } from './HttpHeader';
import { ContentType } from './ContentType';
import { PageOptions } from '../types/PageList';
import { Optional } from '../types/Types';
import { Text } from '../types/Text';
import { Enum } from '../types/Enum';
import { CacheAge } from '../types/CacheAge';
import { ctx } from '../types/Context';
import { toUuid } from '../types/Uuid';
import { Id } from '../types/Id';
import { on } from '../types/Constructor';
import { asString } from '../types/Text';
import { isDefined, isNotEmpty } from '../types/Is';

export const toPageOptions = (options?: RequestOptions | PageOptions): Optional<PageOptions> =>
  options instanceof RequestOptions ? options.pageOptions : options;

export class RequestOptions extends Enum {
  public requestOptions: { maxRedirects?: number; validateStatus?: (status: number) => boolean; timeout?: CacheAge } = {};

  constructor(
    readonly type: ContentType = ContentType.Json,
    readonly headers: { [key: string]: any } = {},
    public pageOptions?: PageOptions
  ) {
    super(type.name);
    this.headers['Content-Type'] = type.id;
    this.headers[HttpHeader.Correlation] = ctx.request.correlationId ?? toUuid();
  }

  static get Form(): RequestOptions {
    return new RequestOptions(ContentType.Form);
  }

  static get Json(): RequestOptions {
    return new RequestOptions(ContentType.Json);
  }

  static get Stream(): RequestOptions {
    return new RequestOptions(ContentType.Stream);
  }

  static get Text(): RequestOptions {
    return new RequestOptions(ContentType.Text);
  }

  static get Xml(): RequestOptions {
    return new RequestOptions(ContentType.Xml);
  }

  page = (options: PageOptions): this => {
    this.pageOptions = options;
    return this;
  };

  authorization = (auth: string): this => this.setHeader('Authorization', auth);

  apiKey = (apiKey: string): this => this.setHeader('apiKey', apiKey);

  setHeader = (key: Text, value: Id | boolean): this => on(this, t => (t.headers[asString(key)] = value));

  setHeaderUnlessPresent = (key: string, value?: Id | boolean): this => (value ? this.setHeader(key, this.headers[key] ?? value) : this);

  accept = (type: ContentType): this => this.setHeader('Accept', type.id);

  bearer = (jwt: Text): this => {
    return isNotEmpty(jwt) ? this.authorization(`Bearer ${jwt}`) : this;
  };

  basic = (username: Text, password: Text): this => {
    const basicAuth = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
    return this.authorization(`Basic ${basicAuth}`);
  };

  maxRedirects = (max?: number): this => {
    this.requestOptions.maxRedirects = max;
    return this;
  };

  validateStatus = (validate?: (status: number) => boolean): this => {
    this.requestOptions.validateStatus = validate;
    return this;
  };

  timeout = (t?: CacheAge): this => {
    this.requestOptions.timeout = t;
    return this;
  };
}

export const isRequestOptions = (o?: unknown): o is RequestOptions => isDefined(o) && o instanceof RequestOptions;
