import { Func, inFuture, inPast, isDefined, isFunction, isIn, isNotEmpty, isString, List, meta, Results, Text, toList } from '../types';
import { validate, Validator } from './Validate';

export type Constraint = Func<boolean | Results, any>;

export const constraint = <T>(c: Constraint, message: Text): PropertyDecorator => (subject: unknown, property: string | symbol): void => {
  const cs = meta(subject).property(property).get<List<Validator>>('constraint') ?? toList<Validator>();
  meta(subject)
    .property(property)
    .set('constraint', cs.add({ property, constraint: c, text: message }));
};

export const defined = (message?: Text): PropertyDecorator => constraint(v => isDefined(v), message ?? 'Property {property} must be defined.');

export const required = (message?: Text): PropertyDecorator =>
  constraint(v => isNotEmpty(v), message ?? 'Property {property} is required, and may not be empty.');

export const notEmpty = (message?: Text): PropertyDecorator => constraint(v => isNotEmpty(v), message ?? 'Property {property} may not be empty.');

export const valid = (): PropertyDecorator => constraint(v => validate(v), '');

export const includes = (sub: string, message?: string): PropertyDecorator =>
  constraint(s => isDefined(s) && isString(s) && s.includes(sub), message ?? `Value {actual} must include '${sub}'.`);

export const inList = (values: unknown[], message?: Text): PropertyDecorator =>
  constraint(v => isDefined(v) && isIn(v, values), message ?? 'Value {actual} must appear in list.');

export const gt = (limit: number, message?: Text): PropertyDecorator => constraint(v => v > limit, message ?? `Value {actual} must be larger than '${limit}'.`);

export const gte = (limit: number, message?: Text): PropertyDecorator =>
  constraint(v => v >= limit, message ?? `Value {actual} must be larger than or equal to ${limit}.`);

export const lt = (limit: number, message?: Text): PropertyDecorator => constraint(v => v < limit, message ?? `Value {actual} must be smaller than ${limit}.`);

export const lte = (limit: number, message?: Text): PropertyDecorator =>
  constraint(v => v <= limit, message ?? `Value {actual} must be smaller than or equal to ${limit}.`);

export const past = (message?: Text): PropertyDecorator => constraint(v => inPast(v), message ?? 'Value {actual} must lay in the past.');

export const future = (message?: Text): PropertyDecorator => constraint(v => inFuture(v), message ?? 'Value {actual} must lay in the future.');

export const rule = (message?: Text): PropertyDecorator =>
  constraint(v => (isFunction(v) ? (v() as boolean | Results) : false), message ?? `Value {actual} must be true`);
