import { v4 as uuid } from "uuid";

export type Id = string | number;
export type Code = string | number;

export const newId = (): Id => uuid();
