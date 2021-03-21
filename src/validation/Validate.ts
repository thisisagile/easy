import {
  Enum,
  isArray,
  isDefined,
  isEnum,
  isResults,
  isValidatable,
  isValue,
  list,
  List,
  meta,
  Results,
  Text,
  toName,
  toResult,
  toResults,
  Value,
} from '../types';
import { Constraint } from './Contraints';
import { when } from './When';
import { choose, ParseOptions, toText } from '../utils';

export type Validator = { property: string | symbol; constraint: Constraint; text: Text; actual?: unknown };

export const asResults = (subject: unknown, template: Text, options: ParseOptions = {}): Results =>
  toResults(toResult(toText(subject, template, options), toName(subject)));

const validators = (subject: unknown): List<Validator> =>
  meta(subject)
    .keys<List<Validator>>('constraint')
    .reduce((list, vs) => list.add(vs), list<Validator>());

const runValidator = (v: Validator, subject?: unknown): Results => {
  v.actual = (subject as any)[v.property];
  const res = v.constraint(v.actual);
  return isResults(res) ? res : !res ? asResults(subject, v.text, v) : toResults();
};

const constraints = (subject?: unknown): Results =>
  validators(subject)
    .mapDefined(v => runValidator(v, subject))
    .reduce((rs, r) => rs.add(...r.results), toResults());

export const validate = (subject?: unknown): Results =>
  choose<Results, any>(subject)
    .case(
      s => !isDefined(s),
      s => asResults(s, 'Subject is not defined.')
    )
    .case(
      s => isEnum(s),
      (e: Enum) => (e.isValid ? toResults() : asResults(e, 'This is not a valid {type}.'))
    )
    .case(
      s => isArray(s),
      (e: []) => e.map(i => validate(i)).reduce((rs, r) => rs.add(...r.results), toResults())
    )
    .case(
      s => isValue(s),
      (v: Value) => (v.isValid ? toResults() : asResults(v, 'This is not a valid {type}.'))
    )
    .case(
      s => isValidatable(s),
      v => constraints(v)
    )
    .else(toResults());

export const validateReject = <T>(subject: T): Promise<T> => when(subject).not.isValid.reject();
