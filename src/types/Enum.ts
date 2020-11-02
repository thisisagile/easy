import { Code, Id } from "./Id";

export abstract class Enum {
  constructor(readonly name: string, readonly id: Id = name.toLowerCase(), readonly code: Code = id) {}
}

export const isEnum = (e?: unknown): e is Enum => e instanceof Enum;
