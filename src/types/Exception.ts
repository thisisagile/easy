import { asString, Text, text } from './Text';
import { Enum } from './Enum';
import { isDefined } from './Is';

export class Exception extends Enum {
  static readonly CouldNotExecute = (target: Text, error: Text): Exception => new Exception(`Could not execute on ${target} because ${error}.`);
  static readonly IsMissingId = new Exception('Subject is missing an id');
  static readonly DoesNotExist = new Exception('Does not exist');
  static readonly EnvironmentVariableNotFound = (variable: Text): Exception => new Exception(`Environment variable ${text(variable).upper} could not be found.`);
  static readonly IsNotImplemented = new Exception('Is not implemented');
  static readonly IsNotValid = new Exception('Is not valid');
  static readonly Unknown = new Exception('Unknown error');
  static readonly AlreadyExists = new Exception('Subject already exists');

  constructor(readonly message: string, public reason?: Text) {
    super(message, text(message).pascal.toString());
  }

  because = (reason: Text): Exception => new Exception(this.message, reason);
}

export const isException = (e?: unknown, t?: Text): e is Exception => e instanceof Exception && (isDefined(t) ? e.equals(asString(t)) : true);
