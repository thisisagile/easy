import { Enum, Get, isDefined, Json, ofGet } from '../types';

const formEncode = (body: unknown): string =>
  Object.entries(body).map(([key, value]) => `${key}=${value}`).join("&");

const jsonEncode = (body: unknown): string => JSON.stringify(body);

export class ContentType extends Enum {

  static Json = new ContentType("json", "application/json", b => jsonEncode(b));
  static Text = new ContentType("text", "text/plain", b => b.toString());
  static Xml = new ContentType("xml", "application/xml");
  static Form = new ContentType("form", "application/x-www-form-urlencoded", b => formEncode(b));

  private constructor(name: string, readonly type: string, private readonly encoder?: Get<string>) {
    super(name, type);
  }

  encode = (body?: Json): string => isDefined(body) ? ofGet(this.encoder, body) : undefined;
}
