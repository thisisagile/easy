import { Enum } from '../types';

export class HttpVerb extends Enum {
  static Get = new HttpVerb('Get');
  static Put = new HttpVerb('Put');
  static Patch = new HttpVerb('Patch');
  static Post = new HttpVerb('Post');
  static Delete = new HttpVerb('Delete');

  constructor(name: string) {super(name, name.toLowerCase(), name.toUpperCase()); }
}
