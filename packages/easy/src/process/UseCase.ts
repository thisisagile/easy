import { Enum as Scope } from './Scope';
import type { Enum as App } from './Apps';
import { Enum as EasyEnum } from '../types/Enum';
import { kebab, Text } from '../types/Text';
import { List, toList } from '../types/List';
import { isIn, isString } from '../types/Is';
import { IdNamePlain } from '../types/IdName';
import { text } from '../types/ToText';

export class Enum extends EasyEnum {
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

  for(item: string | IdNamePlain): Enum {
    return new Enum(this.app, `${this.name} ${isString(item) ? item : item?.name}`, kebab(`${this.id} ${isString(item) ? item : item.id}`)).with(
      ...this.scopes.map(s => s?.for(item))
    );
  }
}

export const create = (app: App, name: string, id: Text = text(name).kebab, scopes: Iterable<Scope> = []): Enum =>
  new Enum(
    app,
    name,
    id,
    toList(Array.from(scopes))
      .flatMap(scope => scope.expand())
      .distinct()
  );

export const byScopes = <U extends Enum>(values: Iterable<U>, ...scopes: Scope[]): List<U> =>
  toList(Array.from(values)).filter(useCase => useCase.scopes.some(useCaseScope => isIn(useCaseScope, scopes)));
