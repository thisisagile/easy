import { asString, Text } from './Text';
import { Exception, isException } from './Exception';
import { isResponse, Response } from '../http/Response';
import { isResults, Results } from './Results';
import { Result } from './Result';
import { choose } from './Case';
import { isError, isString } from './Is';
import { Optional } from './Types';

export type ErrorOrigin = Text | Error | Exception | Response | Results | Result;

export const errorMessage = (e: unknown): Optional<string> =>
  choose(e)
    .type(isResponse, r => r.body.error?.errors?.[0]?.message ?? r.body.error?.message)
    .type(isException, ex => asString(ex.reason) || ex.message)
    .type(isResults, rs => rs.results[0]?.message)
    .type(isError, e => e.message)
    .type(isString, s => s)
    .else(() => undefined);
