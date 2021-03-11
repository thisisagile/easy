import { Enum } from '../types';

export class Scope extends Enum {
  static readonly Basic = new Scope('Basic');
  static readonly Auth = new Scope('Authorization');
  static readonly Admin = new Scope('Administration');
}
