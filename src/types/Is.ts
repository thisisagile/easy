import { isInstance as asInstance, isObject as asObject } from "class-validator";
import { Constructor } from "./Constructor";
import { isAn } from './IsA';

export const isDefined = (o?: unknown): boolean => o !== undefined && o !== null;

export const isEmpty = (o?: unknown): boolean => o === "" || o === null || o === undefined;

export const isString = (o?: unknown): o is string => o instanceof String || typeof o === "string";

export const isObject = (o?: unknown): o is Object => asObject(o);

export const isArray = <T = any>(o?: unknown): o is Array<T> => isDefined(o) && o instanceof Array;

export const isInstance = <T>(o: unknown, ctor: Constructor<T>): o is T => asInstance(o, ctor);

export const isIn = (o: unknown, values: unknown[]): boolean => isArray(values) && values.some(v => v === o);

export const isError = (e: unknown): e is Error => isAn<Error>(e, "name", "message");
