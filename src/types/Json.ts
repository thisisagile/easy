import { isA } from './IsA';

export type JsonValue = string | number | boolean | null | Json | JsonValue[];
export type Json = { [key: string]: JsonValue };

export const isJson = (subject?: unknown): subject is { toJSON: () => Json } => isA<{ toJSON: () => Json }>(subject, 'toJSON');

export const json = {
  parse: (subject: unknown): Json => JSON.parse(JSON.stringify(subject ?? {})),
  merge: (...subjects: unknown[]): Json => subjects.map(s => json.parse(s)).reduce((js, j) => ({ ...js, ...j }), {}),
  omit: (subject: unknown, ...keys: string[]): Json =>
    keys.reduce((js, k) => {
      delete js[k];
      return js;
    }, json.parse(subject)),
};

export const toJson = json.merge;
