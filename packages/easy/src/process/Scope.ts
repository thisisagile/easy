import { Enum, IdName, isString, kebab, Text, text } from '../types';

export class Scope extends Enum {
  // static readonly Basic = new Scope('Basic');
  // static readonly Auth = new Scope('Authorization', 'auth');
  // static readonly Admin = new Scope('Administration', 'admin');

  protected constructor(readonly name: string, id: Text = text(name).kebab) {
    super(name, id.toString());
  }

  for(item: string | IdName): Scope {
    return new Scope(`${this.name} ${isString(item) ? text(item).title : item.name}`, kebab(`${this.id} ${isString(item) ? item : item.id}`));
  }
}
