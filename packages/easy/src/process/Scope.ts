import { Enum as EasyEnum } from '../types/Enum';
import type { Text } from '../types/Text';
import { kebab } from '../types/Text';
import { List, toList } from '../types/List';
import { isString } from '../types/Is';
import { IdNamePlain } from '../types/IdName';
import { text } from '../types/ToText';

export class Enum extends EasyEnum {
  constructor(
    readonly name: string,
    id: Text = text(name).kebab,
    readonly subs: List<Enum> = toList()
  ) {
    super(name, id.toString());
  }

  for(item: string | IdNamePlain): Enum {
    return new Enum(`${this.name} ${isString(item) ? text(item).title : item.name}`, kebab(`${this.id} ${isString(item) ? item : item.id}`));
  }

  combines(...scopes: Enum[]): this {
    this.subs.add(scopes);
    return this;
  }

  expand(): List<Enum> {
    return this.subs
      .flatMap(s => s.expand())
      .add(this)
      .distinct();
  }
}

export const create = (name: string, id: Text = text(name).kebab, subs: Iterable<Enum> = []): Enum => new Enum(name, id, toList(Array.from(subs)));
