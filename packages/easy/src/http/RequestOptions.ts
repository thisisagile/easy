import { ctx, Enum, isNotEmpty, Text, toUuid } from '../types';
import { HttpHeader } from './HttpHeader';
import { ContentType } from './ContentType';

export class RequestOptions extends Enum {
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

  constructor(readonly type: ContentType = ContentType.Json, readonly headers: { [key: string]: any } = {}) {
    super(type.name);
    this.headers['Content-Type'] = type.id;
    this.headers[HttpHeader.Correlation] = ctx.request.correlationId ?? toUuid();
  }

  authorization = (auth: string): this => {
    this.headers.Authorization = auth;
    return this;
  };

  apiKey = (apiKey: string): this => {
    this.headers.apiKey = apiKey;
    return this;
  };

  accept = (type: ContentType): this => {
    this.headers.Accept = type.id;
    return this;
  };

  bearer = (jwt: Text): this => {
    return isNotEmpty(jwt) ? this.authorization(`Bearer ${jwt}`) : this;
  };

  basic = (username: Text, password: Text): this => {
    const basicAuth = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
    return this.authorization(`Basic ${basicAuth}`);
  };
}
