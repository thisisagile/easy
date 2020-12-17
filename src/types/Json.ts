import { isA } from './IsA';

export type JsonValue = string | number | boolean | null | Json | JsonValue[];
export type Json = { [key: string]: JsonValue };

export const isJson = (subject?: unknown): subject is { toJSON: () => Json } => isA<{ toJSON: () => Json }>(subject, 'toJSON');

export const toJson = (...items: unknown[]): Json => items.map(i => JSON.parse(JSON.stringify(i ?? {}))).reduce((json, j) => ({ ...json, ...j }), {});
