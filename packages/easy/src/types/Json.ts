import { isA } from './IsA';
import { isEmpty, isObject } from './Is';
import { Get, ofGet } from './Get';
import { ifDefined } from '../utils/If';
import { TypeGuard } from './TypeGuard';
import { entries } from './Object';

export type JsonValue = string | number | boolean | null | Json | JsonValue[];
export type Json = { [key: string]: JsonValue };

export const isJson: TypeGuard<{ toJSON: () => Json }> = (subject?: unknown): subject is { toJSON: () => Json } =>
  isA<{ toJSON: () => Json }>(subject, 'toJSON');

export const json = {
  parse: <T extends Json = Json>(subject: unknown): T => JSON.parse(JSON.stringify(subject ?? {})),
  merge: (...subjects: unknown[]): Json => json.parse(subjects.map(s => asJson(s, s => json.parse(s))).reduce((js, j) => ({ ...js, ...j }), {})),
  delete: <T extends Json = Json>(subject: T, key: string): T => {
    ifDefined(subject, () => delete (subject as any)[key]);
    return subject;
  },
  set: <T extends Json = Json>(subject: T, key = '', value?: unknown): T =>
    isEmpty(key) ? subject : value !== undefined ? { ...(subject as any), ...{ [key]: value as JsonValue } } : json.delete(subject, key),
  omit: <T extends Json = Json>(subject: T, ...keys: string[]): T => keys.reduce((js, k) => json.delete(js, k), json.parse<T>(subject)),
  defaults: <T extends Json = Json>(options: Partial<T> = {}, defaults: Partial<T> = {}): T => json.merge(defaults, options) as T,
  isSubset: (subject: Json, subset: Json): boolean => !entries(subset).some(([k, v]) => subject[k] !== v),
};

export const toJson = json.merge;

export const asJson = (j?: unknown, alt: Get<Json> = {}): Json => (isJson(j) ? j.toJSON() : isObject(j) ? (j as Json) : ofGet(alt, j));

class Any<T extends Json> {
  constructor(readonly value: T) {}

  merge = (...subjects: T[]): Any<T> => any<T>(json.merge(this.value, ...subjects) as T);
  delete = (key: keyof T): Any<T> => any<T>(json.delete<T>(this.value, key as string));
  omit = (...keys: (keyof T)[]): Any<T> => any<T>(json.omit<T>(this.value, ...(keys as string[])));
  set = (key: keyof T, value?: unknown): Any<T> => any<T>(json.set(this.value, key as string, value));

  toJSON(): Json {
    return this.value;
  }
}

export const any = <T extends Json = Json>(value: T): Any<T> => new Any<T>(value);
