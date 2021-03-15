import { Enum, Get, ifGet, ofGet, toString } from '../types';
import formUrlEncoded from 'form-urlencoded';

export class ContentType extends Enum {
  static Form = new ContentType('form', 'application/x-www-form-urlencoded', b => formUrlEncoded(b));
  static Json = new ContentType('json', 'application/json', b => JSON.stringify(b));
  static Stream = new ContentType('stream', 'application/octet-stream', b => toString(b));
  static Text = new ContentType('text', 'text/plain', b => toString(b));
  static Xml = new ContentType('xml', 'application/xml');

  private constructor(name: string, readonly type: string, private readonly encoder?: Get<string>) {
    super(name, type);
  }

  encode = (body?: unknown): string => ifGet(body, ofGet(this.encoder, body), undefined);
}
