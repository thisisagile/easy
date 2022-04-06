import { isA } from './IsA';
import { isDefined, isEmpty, isObject } from './Is';
import { Get, ofGet } from './Get';

export type JsonValue = string | number | boolean | null | Json | JsonValue[];
export type Json = { [key: string]: JsonValue };

export const isJson = (subject?: unknown): subject is { toJSON: () => Json } => isA<{ toJSON: () => Json }>(subject, 'toJSON');

export const json = {
  parse: (subject: unknown): Json => JSON.parse(JSON.stringify(subject ?? {})),
  merge: (...subjects: unknown[]): Json => json.parse(subjects.map(s => asJson(s, s => json.parse(s))).reduce((js, j) => ({ ...js, ...j }), {})),
  delete: (subject: unknown, key: string): Json => {
    delete (subject as any)[key];
    return subject as Json;
  },
  set: (subject: unknown, key = '', value?: unknown): Json =>
    isEmpty(key) ? subject : isDefined(value) ? { ...(subject as any), ...{ [key]: value as Json } } : json.delete(subject, key),
  omit: (subject: unknown, ...keys: string[]): Json => keys.reduce((js, k) => json.delete(js, k), json.parse(subject)),
};

export const toJson = json.merge;

export const asJson = (j?: unknown, alt: Get<Json> = {}): Json => (isJson(j) ? j.toJSON() : isObject(j) ? (j as Json) : ofGet(alt, j));

class Any {
  constructor(readonly value: unknown = {}) {}

  delete = (key: string): Any => new Any(json.delete(this.value, key));
  set = (key: string, value?: unknown): Any => new Any(json.set(this.value, key, value));
}

export const any = (value: unknown): Any => new Any(value);
