import { is } from "../utils/Is";
import { meta } from "../utils/Meta";

export type Constraint = (value: unknown) => boolean;

export const constraint = (constraint: Constraint, message: string): PropertyDecorator =>
  (subject: unknown, property: string): void => {
    meta(subject).property(property).set("constraint", { property, constraint, message });
  };

export const defined = (message?: string): PropertyDecorator =>
  constraint(v => is(v).defined, message ?? "$property must be defined.");

export const required = (message?: string): PropertyDecorator =>
  constraint(v => is(v).defined, message ?? "$property is required.");

export const valid = (message?: string): PropertyDecorator =>
  constraint(v => is(v).isValid, message ?? "$property must be valid.");

export const custom = (c: Constraint, message: string): PropertyDecorator =>
  constraint(v => c(v), message);

export const gt = (limit: number, message?: string): PropertyDecorator =>
  constraint(v => v > limit, message ?? "Value for $property must be larger than $actual.");

export const gte = (limit: number, message?: string): PropertyDecorator =>
  constraint(v => v >= limit, message ?? "Value for $property must be larger than or equal to $actual.");

export const lt = (limit: number, message?: string): PropertyDecorator =>
  constraint(v => v < limit, message ?? "Value for $property must be smaller than $actual.");

export const lte = (limit: number, message?: string): PropertyDecorator =>
  constraint(v => v <= limit, message ?? "Value for $property must be smaller than or equal to $actual.");

