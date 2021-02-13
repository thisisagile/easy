import { Enum, isDefined, isEnum, isResults, isValidatable, isValue, list, List, meta, results, Results, Text, toResult, Value } from '../types';
import { Constraint } from './Contraints';
import { when } from './When';
import { choose, ParseOptions, toText } from '../utils';

export type Validator = { property: string; constraint: Constraint; text: Text; actual?: unknown };

export const asResults = (subject: unknown, template: Text, options: ParseOptions = {}): Results => results(toResult(toText(subject, template, options)));

const validators = (subject: unknown): List<Validator> =>
  meta(subject)
    .keys<List<Validator>>('constraint')
    .reduce((list, vs) => list.add(vs), list<Validator>());

const runValidator = (v: Validator, subject?: unknown): Results => {
  v.actual = (subject as any)[v.property];
  const res = v.constraint(v.actual);
  return isResults(res) ? res : !res ? asResults(subject, v.text, v) : undefined;
};

const constraints = (subject?: unknown): Results =>
  validators(subject)
    .mapDefined(v => runValidator(v, subject))
    .reduce((rs, r) => rs.add(...r.results), results());

export const validate = (subject?: unknown): Results =>
  choose<Results, unknown>(subject)
    .case(s => !isDefined(s), results('Subject is not defined.'))
    .case(
      s => isEnum(s),
      (e: Enum) => (e.isValid ? results() : asResults(e, 'This is not a valid {type.name}.'))
    )
    .case(
      s => isValue(s),
      (v: Value) => (v.isValid ? results() : asResults(v, 'This is not a valid {type.name}.'))
    )
    .case(
      s => isValidatable(s),
      v => constraints(v)
    )
    .else(results());

export const validateReject = <T>(subject?: T): Promise<T> => when(subject).not.isValid.reject();
