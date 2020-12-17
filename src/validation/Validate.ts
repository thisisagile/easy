import { isDefined, meta, result, Result, results, Results, Text } from '../types';
import { Constraint } from './Contraints';
import { when } from './When';

export type Validator = { property: string; constraint: Constraint; message: Text; actual?: unknown };

const parse = (subject: unknown, v: Validator): Result =>
  result(
    v.message
      .toString()
      .replace('$subject', subject.constructor.name)
      .replace('$property', `Property '${v.property}'`)
      .replace('$actual', `Value '${v.actual}' for property '${v.property}'`),
    subject.constructor.name,
    v.property
  );

export const validate = (subject?: unknown): Results => {
  return !isDefined(subject)
    ? results('Subject can not be validated')
    : meta(subject)
        .keys<Validator>('constraint')
        .mapDefined(v => {
          v.actual = (subject as any)[v.property];
          return !v.constraint(v.actual) ? parse(subject, v) : undefined;
        })
        .reduce((rs, r) => rs.add(r), results());
};

export const validateReject = <T>(subject: T): Promise<T> => when(subject).not.isValid.reject();
