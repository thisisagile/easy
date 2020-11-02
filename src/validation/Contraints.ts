import { meta } from "../utils";
import { isDefined, isIn, isString, isValidatable } from "../types";

export type Constraint = (value: unknown) => boolean;

export const constraint = (constraint: Constraint, message: string): PropertyDecorator =>
  (subject: unknown, property: string): void => {
    meta(subject).property(property).set("constraint", { property, constraint, message });
  };

export const defined = (message?: string): PropertyDecorator =>
  constraint(v => isDefined(v), message ?? "$property must be defined.");

export const required = (message?: string): PropertyDecorator =>
  constraint(v => isDefined(v), message ?? "$property is required.");

export const valid = (message?: string): PropertyDecorator =>
  constraint(v => isValidatable(v) && v.isValid, message ?? "$property must be valid.");

export const includes = (sub: string, message?: string): PropertyDecorator =>
  constraint(s => isDefined(s) && isString(s) && s.includes(sub), message ?? `$value must include '${sub}'.`);

export const inList = (values: unknown[], message?: string): PropertyDecorator =>
  constraint(v => isDefined(v) && isIn(v, values), message ?? "$value must appear in list.");

export const gt = (limit: number, message?: string): PropertyDecorator =>
  constraint(v => v > limit, message ?? "Value for $property must be larger than $actual.");

export const gte = (limit: number, message?: string): PropertyDecorator =>
  constraint(v => v >= limit, message ?? "Value for $property must be larger than or equal to $actual.");

export const lt = (limit: number, message?: string): PropertyDecorator =>
  constraint(v => v < limit, message ?? "Value for $property must be smaller than $actual.");

export const lte = (limit: number, message?: string): PropertyDecorator =>
  constraint(v => v <= limit, message ?? "Value for $property must be smaller than or equal to $actual.");

