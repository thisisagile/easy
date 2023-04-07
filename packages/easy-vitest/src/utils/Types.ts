import { asString, isFunction } from './Utils';

export interface MatcherResult {
  pass: boolean;
  message: () => string;
  // If you pass these, they will automatically appear inside a diff when
  // the matcher does not pass, so you don't need to print the diff yourself
  actual?: unknown;
  expected?: unknown;
}

export type Constructor<T> = { new (...args: any[]): T };

export type Message<P> = Text | ((...params: P[]) => Text);

export const toMessage = <P>(g: Message<P>, ...params: P[]): string => asString(isFunction(g) ? g(...params) : g);

export type Validatable = { isValid: boolean };

export type Result = { domain?: string; location?: string; message: string };

export type Results = Validatable & { results: Result[] };

export type Uri = Text;

export type Id = string | number;

export type JsonValue = string | number | boolean | null | Json | JsonValue[];

export type Json = { [key: string]: JsonValue };

export type Exception = { id: Id; reason?: string };

export type Text = { toString: () => string };

export type Query = Text;

export type UseCase = { app: { id: Text }; id: Text };

export type Tester = { url: string };

export type CreateMutable<T> = { -readonly [P in keyof T]: T[P] };

export type Procedure = (...args: any[]) => any;
export type Methods<T> = {
  [K in keyof T]: T[K] extends Procedure ? K : never;
}[keyof T] &
  (string | symbol);
export type Properties<T> = {
  [K in keyof T]: T[K] extends Procedure ? never : K;
}[keyof T] &
  (string | symbol);
