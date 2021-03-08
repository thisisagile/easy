import { Text, toString } from './Text';
import { Enum } from './Enum';
import { isDefined } from './Is';
import { stringify } from '../utils';

export class Exception extends Enum {
  static readonly IsMissingId = new Exception('Subject is missing an id');
  static readonly DoesNotExist = new Exception('Does not exist');
  static readonly IsNotImplemented = new Exception('Is not implemented');
  static readonly IsNotValid = new Exception('Is not valid');
  static readonly Unknown = new Exception('Unknown error');

  constructor(readonly message: string, public reason?: Text) {
    super(message, stringify(stringify(message).title).trim);
  }

  because = (reason: Text): Exception => new Exception(this.message, reason);
}

export const isException = (e?: unknown, t?: Text): e is Exception => e instanceof Exception && (isDefined(t) ? e.equals(toString(t)) : true);
