import { asString, Text, text } from './Text';
import { Enum } from './Enum';
import { isDefined } from './Is';
import { Id } from './Id';

export class Exception extends Enum {
  static readonly AlreadyExists = new Exception('Subject already exists');
  static readonly DoesNotExist = new Exception('Does not exist');
  static readonly IsMissingId = new Exception('Subject is missing an id');
  static readonly IsNotImplemented = new Exception('Is not implemented');
  static readonly IsNotValid = new Exception('Is not valid');
  static readonly Unknown = new Exception('Unknown error');

  constructor(
    readonly message: string,
    id?: Id,
    readonly reason?: Text
  ) {
    super(message, id ?? text(message).pascal.toString());
  }

  static readonly CouldNotExecute = (target: Text): Exception => new Exception(`Could not execute ${target}.`, 'CouldNotExecute');

  static readonly CouldNotValidate = (target: Text): Exception => new Exception(`Could not validate ${target}.`, 'CouldNotValidate');

  static readonly EnvironmentVariableNotFound = (variable: Text): Exception =>
    new Exception(`Environment variable ${text(variable).upper} could not be found.`, 'EnvironmentVariableNotFound');

  because = (reason: Text): Exception => new Exception(this.message, this.id, reason);
}

export const isException = (e?: unknown, t?: Text): e is Exception => e instanceof Exception && (isDefined(t) ? e.equals(asString(t)) : true);
export const isDoesNotExist = (e?: unknown): e is Exception => e instanceof Exception && Exception.DoesNotExist.equals(e);
