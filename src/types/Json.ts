import { isA } from './IsA';

export type JsonValue = string | number | boolean | null | Json | JsonValue[];
export type Json = { [key: string]: JsonValue };

export const isJson = (subject?: unknown): subject is { toJSON: () => Json } => isA<{ toJSON: () => Json }>(subject, 'toJSON');

export const jsonify = (subject: unknown = {}): Json => ({ ...JSON.parse(JSON.stringify(subject)) });

export const toJson = (subject: unknown = {}, add: unknown = {}): Json => ({
  ...(isJson(subject) ? subject.toJSON() : jsonify(subject)),
  ...(isJson(add) ? add.toJSON() : jsonify(add)),
});
