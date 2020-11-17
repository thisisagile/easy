import { ContentType } from './ContentType';

export class RequestOptions {
  headers: { [key: string]: any } = {};

  constructor(contentType: ContentType = ContentType.Json) {
    this.contentType = contentType;
    // this.headers['X-Correlation-Id'] = context.request.correlation ?? newId();
  }

  static get json(): RequestOptions {
    return new RequestOptions();
  }

  static get text(): RequestOptions {
    return new RequestOptions(ContentType.Text);
  }

  static get xml(): RequestOptions {
    return new RequestOptions(ContentType.Xml);
  }

  static get form(): RequestOptions {
    return new RequestOptions(ContentType.Form);
  }

  get contentType(): ContentType {
    return ContentType.byId(this.headers['Content-Type']);
  }

  set contentType(type: ContentType) {
    this.headers['Content-Type'] = type.id;
  }

  type(type: ContentType): RequestOptions {
    this.contentType = type;
    return this;
  }

  authorization(auth: string): RequestOptions {
    this.headers.Authorization = auth;
    return this;
  }

  accept(type: ContentType): RequestOptions {
    this.headers['Accept'] = type.id;
    return this;
  }

  //
  // bearer(jwt: Jwt): RequestOptions {
  //   return Try.ofDefined(() => jwt)
  //     .map(j => this.authorization(`Bearer ${j.value}`))
  //     .recover(() => this).value;
  // }
}
