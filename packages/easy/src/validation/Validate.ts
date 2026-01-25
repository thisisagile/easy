import { Constraint } from './Contraints';
import { when } from './When';
import type { TemplateOptions } from '../types/Template';
import { isResults, Results, toResults } from '../types/Results';
import { toName } from '../types/Constructor';
import { toResult } from '../types/Result';
import { List, toList } from '../types/List';
import { meta } from '../types/Meta';
import { isArray, isFunction } from '../types/Is';
import type { Text } from '../types/Text';
import { asString } from '../types/Text';
import { choose } from '../types/Case';
import { isEnum } from '../types/Enum';
import { isValue } from '../types/Value';
import { isValidatable } from '../types/Validatable';
import { text } from '../types/ToText';

export type Validator = { property: string | symbol; constraint: Constraint; text: Text; actual?: Text };

export const asResults = (subject: unknown, template: Text, options: TemplateOptions = {}): Results =>
  toResults(toResult(text(template).parse(subject, options), toName(subject)));

const validators = (subject: unknown): List<Validator> =>
  meta(subject)
    .keys<List<Validator>>('constraint')
    .reduce((list, vs) => list.add(vs), toList<Validator>());

const runValidator = (v: Validator, subject?: unknown): Results => {
  try {
    const actual = isFunction((subject as any)[v.property]) ? (subject as any)[v.property]() : (subject as any)[v.property];
    const constraint = v.constraint(actual);
    return isResults(constraint)
      ? constraint
      : !constraint
        ? asResults(subject, v.text, {
            ...v,
            actual,
          })
        : toResults();
  } catch (e) {
    return asResults(subject, asString(e));
  }
};

const constraints = (subject?: unknown): Results =>
  validators(subject)
    .map(vs => runValidator(vs, subject))
    .reduce((rs, r) => rs.add(...r.results), toResults());

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
