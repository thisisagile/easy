import { Text } from './Text';
import { Enum } from './Enum';
import { isDefined } from './Is';
import { stringify } from '../utils';

export class Exception extends Enum {
  static readonly DoesNotExist = new Exception('Does not exist');
  static readonly IsNotImplemented = new Exception('Is not implemented');
  static readonly IsNotValid = new Exception('Is not valid');
  static readonly Unknown = new Exception('Unknown error');

  constructor(readonly message: string, public info?: string) {
    super(message, stringify(stringify(message).title).trim);
  }

  with = (info: string): Exception => new Exception(this.message, info);
}

export const isException = (e?: unknown, t?: Text): e is Exception => e instanceof Exception && (isDefined(t) ? e.equals(t.toString()) : true);
