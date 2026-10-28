import formUrlEncoded from 'form-urlencoded';
import { Enum as EasyEnum } from '../types/Enum';
import { lazyRegistry } from '../types/Registry';
import { Get, ofGet } from '../types/Get';
import { asString } from '../types/Text';

export class Enum extends EasyEnum {
  constructor(
    name: string,
    readonly type: string,
    protected readonly encoder: Get<string> = b => asString(b)
  ) {
    super(name, type);
  }

  encode = (body?: unknown): string => ofGet(this.encoder, body);
}

export const create = (name: string, type: string, encoder?: Get<string>): Enum =>
  encoder === undefined ? new Enum(name, type) : new Enum(name, type, encoder);

export const Form = /* @__PURE__ */ new Enum('form', 'application/x-www-form-urlencoded', b => formUrlEncoded(b));
export const Json = /* @__PURE__ */ new Enum('json', 'application/json', b => b);
export const RawJson = /* @__PURE__ */ new Enum('rawJson', 'application/json', b => b);
export const Stream = /* @__PURE__ */ new Enum('stream', 'application/octet-stream');
export const Text = /* @__PURE__ */ new Enum('text', 'text/plain');
export const Xml = /* @__PURE__ */ new Enum('xml', 'application/xml');

export const { all, byId, byIds, filter, first } = /* @__PURE__ */ lazyRegistry(() => ({ Form, Json, RawJson, Stream, Text, Xml }));
