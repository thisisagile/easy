import { inFuture, inPast, isDefined, isIn, isString, meta, Text } from '../types';
import { validate } from './Validate';

export type Constraint = (value: unknown) => boolean;

export const constraint = <T>(c: Constraint, message: Text): PropertyDecorator => (subject: unknown, property: string): void => {
  meta(subject).property(property).set('constraint', { property, constraint: c, message });
};

export const defined = (message?: Text): PropertyDecorator => constraint(v => isDefined(v), message ?? '$property must be defined.');

export const required = (message?: Text): PropertyDecorator => constraint(v => isDefined(v), message ?? '$property is required.');

export const valid = (message?: Text): PropertyDecorator => constraint(v => validate(v).isValid, message ?? '$property must be valid.');

export const includes = (sub: string, message?: string): PropertyDecorator =>
  constraint(s => isDefined(s) && isString(s) && s.includes(sub), message ?? `$actual must include '${sub}'.`);

export const inList = (values: unknown[], message?: Text): PropertyDecorator =>
  constraint(v => isDefined(v) && isIn(v, values), message ?? '$actual must appear in list.');

export const gt = (limit: number, message?: Text): PropertyDecorator => constraint(v => v > limit, message ?? `$actual must be larger than '${limit}'.`);

export const gte = (limit: number, message?: Text): PropertyDecorator =>
  constraint(v => v >= limit, message ?? `$actual must be larger than or equal to ${limit}.`);

export const lt = (limit: number, message?: Text): PropertyDecorator => constraint(v => v < limit, message ?? `$actual must be smaller than ${limit}.`);

export const lte = (limit: number, message?: Text): PropertyDecorator =>
  constraint(v => v <= limit, message ?? `$actual must be smaller than or equal to ${limit}.`);

export const past = (message?: Text): PropertyDecorator => constraint(v => inPast(v), message ?? '$actual must lay in the past.');

export const future = (message?: Text): PropertyDecorator => constraint(v => inFuture(v), message ?? '$actual must lay in the future.');
