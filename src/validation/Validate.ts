import {
  Enum,
  isDefined,
  isEnum,
  isResults,
  isValidatable,
  isValue,
  list,
  List,
  meta,
  Result,
  results,
  Results,
  Text,
  toName,
  toResult,
  Value,
} from '../types';
import { Constraint } from './Contraints';
import { when } from './When';
import { asText, choose } from '../utils';

export type Validator = { property: string; constraint: Constraint; text: Text; actual?: unknown };

const asResult = (subject?: unknown, message?: Text): Result => toResult(message, toName(subject));

const validators = (subject: unknown): List<Validator> =>
  meta(subject)
    .keys<List<Validator>>('constraint')
    .reduce((list, vs) => list.add(vs), list<Validator>());

const run = (v: Validator, subject?: unknown): Results => {
  console.log('run', toName(subject), v.property);
  v.actual = (subject as any)[v.property];
  const res = v.constraint(v.actual);
  return isResults(res) ? res : !res ? results(asResult(subject, asText(subject, v.text, v))) : undefined;
};

const val = (subject?: unknown): Results => {
  console.log('val', toName(subject));
  const vals = validators(subject);
  const res = vals.mapDefined(v => run(v, subject));
  return res.reduce((rs, r) => rs.add(...r.results), results());
};

export const validate = (subject?: unknown): Results => {
  console.log('validate', toName(subject));
  return choose<Results, unknown>(subject)
    .case(s => !isDefined(s), results('Subject is not defined.'))
    .case(
      s => isEnum(s),
      (e: Enum) => (e.isValid ? results() : results(asText(e, 'This is not a valid {type.name}.')))
    )
    .case(
      s => isValue(s),
      (v: Value) => (v.isValid ? results() : results(asText(v, 'This is not a valid {type.name}.')))
    )
    .case(
      s => isValidatable(s),
      v => val(v)
    )
    .else(results());
};

export const validateReject = <T>(subject: T): Promise<T> => when(subject).not.isValid.reject();
