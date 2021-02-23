import { Text } from './Text';
import { Enum } from './Enum';
import { isDefined } from './Is';
import { stringify } from '../utils';

export class Exception extends Enum {
  static readonly DoesNotExist = new Exception('Does not exist');
  static readonly IsNotValid = new Exception('Is not valid');

  constructor(readonly message: string) {
    super(message, stringify(stringify(message).title).trim);
  }
}

export const isException = (e?: unknown, t?: Text): e is Exception => e instanceof Exception && (isDefined(t) ? e.equals(t.toString()) : true);
