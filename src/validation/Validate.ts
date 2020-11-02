import { isDefined, result, Result } from "../types";
import { meta, toReduceDefined } from "../utils";
import { Constraint } from "./Contraints";
import { results, Results } from "./Results";

export type Validator = { property: string, constraint: Constraint, message: string };

const parse = (subject: unknown, v: Validator): Result => {
  const message = v.message
    .replace("$property", `property '${v.property}'`)
    .replace("$subject", subject.constructor.name)
    .replace("$actual", `'${(subject as any)[v.property]}'`);
  return result(message, subject.constructor.name, v.property);
};

export const validate = (subject?: unknown): Results => {
  return (!isDefined(subject))
    ? results("Object can not be validated")
    : meta(subject).keys<Validator>("constraint")
      .reduce((rs, v) => toReduceDefined(rs, !v.constraint((subject as any)[v.property]), parse(subject, v)), [])
      .reduce((rs, r) => rs.add(r), results());
};

export const validateReject = <T>(subject: T): Promise<T> => {
  const results = validate(subject);
  return results.isValid ? Promise.resolve(subject) : Promise.reject(results);
};
