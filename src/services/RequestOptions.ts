import { ContentType } from './ContentType';
import { ctx, Enum, isNotEmpty, JsonValue, toUuid } from '../types';
import { correlationHeader } from '../express';

export class RequestOptions extends Enum {
  static Form = new RequestOptions(ContentType.Form);
  static Json = new RequestOptions(ContentType.Json);
  static Stream = new RequestOptions(ContentType.Stream);
  static Text = new RequestOptions(ContentType.Text);
  static Xml = new RequestOptions(ContentType.Xml);

  constructor(readonly type: ContentType = ContentType.Json, readonly headers: { [key: string]: any } = {}) {
    super(type.name);
    this.headers['Content-Type'] = type.id;
    this.headers[correlationHeader] = ctx.request.correlationId ?? toUuid();
  }

  authorization = (auth: string): this => {
    this.headers.Authorization = auth;
    return this;
  };

  accept = (type: ContentType): this => {
    this.headers.Accept = type.id;
    return this;
  };

  bearer = (jwt: JsonValue): this => {
    if (isNotEmpty(jwt)) {
      this.authorization(`Bearer ${jwt}`);
    }
    return this;
  };
}
