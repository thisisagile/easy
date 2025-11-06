import { Scope } from './Scope';
import { App } from './App';
import { Enum } from '../types/Enum';
import { text } from '../types/Template';
import { kebab, Text } from '../types/Text';
import { List, toList } from '../types/List';
import { isIn, isString } from '../types/Is';
import { IdNamePlain } from '../types/IdName';

export class UseCase extends Enum {
  constructor(
    readonly app: App,
    name: string,
    id: Text = text(name).kebab,
    readonly scopes: List<Scope> = toList<Scope>()
  ) {
    super(name, id.toString());
  }

  with(...s: Scope[]): this {
    this.scopes.add(
      ...toList(s)
        .flatMap(s => s.expand())
        .distinct()
    );
    return this;
  }

  for(item: string | IdNamePlain): UseCase {
    return new UseCase(this.app, `${this.name} ${isString(item) ? item : item?.name}`, kebab(`${this.id} ${isString(item) ? item : item.id}`)).with(
      ...this.scopes.map(s => s?.for(item))
    );
  }

  static byScopes<U extends UseCase>(...s: Scope[]): List<U> {
    return this.filter(u => u.scopes.some(us => isIn(us, s)));
  }
}
