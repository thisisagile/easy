import { Id } from './Id';
import { List } from './List';
import { isAn } from './IsA';
import { meta } from './Meta';
import { isDefined } from './Is';
import { Get, ofGet } from './Constructor';
import { Validatable } from './Validatable';

export abstract class Enum implements Validatable {
  constructor(readonly name: string, readonly id: Id = name.toLowerCase(), readonly code: string = id.toString()) {}

  static all<E extends Enum>(): List<E> {
    return meta(this).values().filter((e: unknown) => isEnum(e));
  }

  static byId<E extends Enum>(id: Id, alt?: Get<E>): E {
    return meta(this).values().first((e: unknown) => isEnum(e) && e.id === id) ?? ofGet(alt);
  }

  get isValid(): boolean { return isDefined(this.id); }

  toString(): string { return this.id.toString(); }
}

export const isEnum = (e?: unknown): e is Enum => isDefined(e) && (e instanceof Enum) && isAn<Enum>(e, 'name', 'id', 'code');
