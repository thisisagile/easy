import { isDefined, list, List, meta, results, Results, Text, toName, toResult } from '../types';
import { Constraint } from './Contraints';
import { when } from './When';
import { asText } from '../utils';

export type Validator = { property: string; constraint: Constraint; text: Text; actual?: unknown };

export const validate = (subject?: unknown): Results => {
  return !isDefined(subject)
    ? results('Subject can not be validated')
    : meta(subject)
        .keys<List<Validator>>('constraint')
        .mapDefined(vs => {
          return vs.mapDefined(v => {
            v.actual = (subject as any)[v.property];
            const res = v.constraint(v.actual);
            return !res ? toResult(asText(subject, v.text, v), toName(subject)) : undefined;
          });
        })
        .reduce((rs, r) => rs.add(...r), results());
};

export const validateReject = <T>(subject: T): Promise<T> => when(subject).not.isValid.reject();

export const validators = (subject: unknown): List<Validator> =>
  meta(subject)
    .keys<List<Validator>>('constraint')
    .reduce((list, vs) => list.add(vs), list<Validator>());

export const val = (subject: unknown): Results => {
  if (!isDefined(subject)) return results('Subject can not be validated.');
  const vals = validators(subject);
  const ress = vals.mapDefined(v => {
    v.actual = (subject as any)[v.property];
    return !v.constraint(v.actual) ? results(asText(subject, v.text, v)) : undefined;
  });
  return ress.reduce((rs, r) => rs.add(r), results());
};
