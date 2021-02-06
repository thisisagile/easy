import { inFuture, inPast, isDefined, isIn, isString, isValidatable, list, List, meta, Text } from '../types';
import { Validator } from './Validate';

export type Constraint = (value: unknown) => boolean;

export const constraint = <T>(c: Constraint, message: Text): PropertyDecorator => (subject: unknown, property: string): void => {
  const cs = meta(subject).property(property).get<List<Validator>>('constraint') ?? list<Validator>();
  meta(subject)
    .property(property)
    .set('constraint', cs.add({ property, constraint: c, text: message }));
};

export const defined = (message?: Text): PropertyDecorator => constraint(v => isDefined(v), message ?? 'Property {property} must be defined.');

export const required = (message?: Text): PropertyDecorator => constraint(v => isDefined(v), message ?? 'Property {property} is required.');

export const valid = (message?: Text): PropertyDecorator => constraint(v => isValidatable(v) && v.isValid, message ?? 'Property {property} must be valid.');

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

export const yes = (message?: Text): PropertyDecorator => constraint(v => !!v, message ?? `Value {actual} must be true`);
