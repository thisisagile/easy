import { Enum } from '../types';
import { Scope } from './Scope';

export class UseCase extends Enum {
  constructor(readonly scope: Scope, readonly name: string, readonly id: string) {
    super(name, id);
  }
}
