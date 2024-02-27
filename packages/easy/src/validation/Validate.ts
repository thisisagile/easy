import {
  asString,
  choose,
  isArray,
  isEnum,
  isFunction,
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
} from '../types';
import { Constraint } from './Contraints';
import { when } from './When';

export type Validator = { property: string | symbol; constraint: Constraint; text: Text; actual?: Text };

export const asResults = (subject: unknown, template: Text, options: TemplateOptions = {}): Results =>
  toResults(toResult(text(template).parse(subject, options), toName(subject)));

const validators = (subject: unknown): List<Validator> =>
  meta(subject)
    .keys<List<Validator>>('constraint')
    .reduce((list, vs) => list.add(vs), toList<Validator>());

const runValidator = (v: Validator, subject?: unknown): Results =>
  tryTo(() => (isFunction((subject as any)[v.property]) ? (subject as any)[v.property]() : (subject as any)[v.property]))
    .map(actual => [actual, v.constraint(actual)])
    .map(([actual, res]) => (isResults(res) ? res : !res ? asResults(subject, v.text, { ...v, actual }) : toResults()))
    .recover(e => asResults(subject, asString(e))).value;

const constraints = (subject?: unknown): Results =>
  tryTo(() => validators(subject))
    .map(vs => vs.mapDefined(v => runValidator(v, subject)))
    .map(res => res.reduce((rs, r) => rs.add(...r.results), toResults())).value;

export const validate = (subject?: unknown): Results =>
  choose(subject)
    .is.not.defined(
      s => s,
      () => toResults('Subject is not defined.')
    )
    .type(isEnum, e => (e.isValid ? toResults() : asResults(e, 'This is not a valid {type}.')))
    .type(isValue, v => (v.isValid ? toResults() : asResults(v, 'This is not a valid {type}.')))
    .type(isArray, a => a.map(i => validate(i)).reduce((rs, r) => rs.add(...r.results), toResults()))
    .type(isValidatable, v => constraints(v))
    .else(toResults());

export const validateReject = <T>(subject: T): Promise<T> => when(subject).not.isValid.reject();

export const isValid = <T>(t: T): boolean => validate(t).isValid;

