import formUrlEncoded from 'form-urlencoded';
import { Enum } from '../types/Enum';
import { Get, ofGet } from '../types/Get';
import { asString } from '../types/Text';

export class ContentType extends Enum {
  static Form = new ContentType('form', 'application/x-www-form-urlencoded', b => formUrlEncoded(b));
  static Json = new ContentType('json', 'application/json', b => b);
  static Stream = new ContentType('stream', 'application/octet-stream');
  static Text = new ContentType('text', 'text/plain');
  static Xml = new ContentType('xml', 'application/xml');

  private constructor(
    name: string,
    readonly type: string,
    protected readonly encoder: Get<string> = b => asString(b)
  ) {
    super(name, type);
  }

  encode = (body?: unknown): string => ofGet(this.encoder, body);
}
