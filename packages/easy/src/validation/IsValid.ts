import type { Validator } from './Validate';
import { isArray, isDefined, isFunction } from '../types/Is';
import { isA } from '../types/IsA';
import { isValue } from '../types/Value';
import { isValidatable } from '../types/Validatable';

type Checked = { isValid: boolean };

// Structural checks instead of instanceof: importing Enum or Results would pull the whole validation graph back into choose and tryTo.
const isEnumLike = (s: unknown): s is Checked =>
  isA<{ name: string; id: unknown; code: string }>(s, 'name', 'id', 'code') && (s.constructor as { isEnum?: boolean } | undefined)?.isEnum === true;

const isResultsLike = (r: unknown): r is Checked => isA<{ results: unknown } & Checked>(r, 'results', 'isValid') && isArray(r.results);

export const validators = (subject: object): Validator[] => {
  // Decorators load reflect-metadata; plain validation should not load it.
  if (typeof Reflect.getMetadata !== 'function') return [];
  return [...Object.getOwnPropertyNames(subject), ...Object.getOwnPropertyNames(Object.getPrototypeOf(subject))].flatMap(property => [
    ...((Reflect.getMetadata(property, subject) as { constraint?: Validator[] } | undefined)?.constraint ?? []),
  ]);
};

const holds = (v: Validator, subject: object): boolean => {
  try {
    const property: unknown = Reflect.get(subject, v.property);
    const outcome = v.constraint(isFunction(property) ? property.call(subject) : property);
    return isResultsLike(outcome) ? outcome.isValid : !!outcome;
  } catch {
    // A throwing constraint is a failed constraint, exactly as validate() reports it.
    return false;
  }
};

export const isValid = (subject?: unknown): boolean => {
  if (!isDefined(subject)) return false;
  if (isEnumLike(subject) || isValue(subject)) return subject.isValid;
  if (isArray(subject)) return subject.every(s => isValid(s));
  if (isValidatable(subject)) return validators(subject).every(v => holds(v, subject));
  return true;
};
