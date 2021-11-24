import {
  asString,
  Enum,
  isArray,
  isDefined,
  isEnum,
  isResults,
  isValidatable,
  isValue,
  List,
  meta,
  Results,
  TemplateOptions,
  text,
  Text,
  toList,
  toName,
  toResult,
  toResults,
  tryTo,
  Value,
} from '../types';
import { Constraint } from './Contraints';
import { when } from './When';
import { choose } from '../utils';

export type Validator = { property: string | symbol; constraint: Constraint; text: Text; actual?: Text };

export const asResults = (subject: unknown, template: Text, options: TemplateOptions = {}): Results =>
  toResults(toResult(text(template).parse(subject, options), toName(subject)));

const validators = (subject: unknown): List<Validator> =>
  meta(subject)
    .keys<List<Validator>>('constraint')
    .reduce((list, vs) => list.add(vs), toList<Validator>());

const runValidator = (v: Validator, subject?: unknown): Results =>
  tryTo(() => (subject as any)[v.property])
    .map(actual => v.constraint(actual))
    .map(res => (isResults(res) ? res : !res ? asResults(subject, v.text, v) : toResults()))
    .recover(e => asResults(subject, asString(e))).value;

const constraints = (subject?: unknown): Results =>
  tryTo(() => validators(subject))
    .map(vs => vs.mapDefined(v => runValidator(v, subject)))
    .map(res => res.reduce((rs, r) => rs.add(...r.results), toResults())).value;

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
