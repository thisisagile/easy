import { Enum, Id } from '../types';

export class Scope extends Enum {
  protected constructor(readonly name: string, readonly id: Id) {
    super(name, id);
  }

  static readonly Basic = new Scope('Basic', 'basic');
  static readonly Auth = new Scope('Authorization', 'auth');
  static readonly Admin = new Scope('Administration', 'admin');
}
