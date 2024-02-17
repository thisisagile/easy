import { Enum, IdName, isIn, isString, kebab, List, Text, text, toList } from '../types';
import { Scope } from './Scope';
import { App } from './App';

export class UseCase extends Enum {
  constructor(readonly app: App, name: string, id: Text = text(name).kebab, readonly scopes: List<Scope> = toList<Scope>()) {
    super(name, id.toString());
  }

  with(...s: Scope[]): this {
    this.scopes.add(...s);
    return this;
  }

  for(item: string | IdName): UseCase {
    return new UseCase(this.app, `${this.name} ${isString(item) ? item : item?.name}`, kebab(`${this.id} ${isString(item) ? item : item.id}`)).with(
      ...this.scopes.map(s => s?.for(item))
    );
  }

  static byScopes<U extends UseCase>(...s: Scope[]): List<U> {
    return this.filter(u => u.scopes.some(us => isIn(us, s)));
  }
}
