import { Id } from './Id';
import { List, toList } from './List';
import { isAn } from './IsA';
import { meta } from './Meta';
import { isDefined, isFunction } from './Is';
import { Validatable } from './Validatable';
import { JsonValue } from './Json';
import { Get, ofGet } from './Get';
import { TypeGuard } from './TypeGuard';

export type EnumConstructor<E = unknown> = {
  byIds<E extends Enum>(ids: Id[]): List<E>;
  byId<E extends Enum>(id: Id, alt?: Get<E, unknown>): E;
  isEnum: boolean;
};

export const isEnumConstructor = <E = unknown>(c: unknown): c is EnumConstructor<E> => isFunction(c) && (c as any).isEnum;

export abstract class Enum implements Validatable {
  static isEnum = true;

  protected constructor(
    readonly name: string,
    readonly id: Id = name.toLowerCase(),
    readonly code: string = id.toString()
  ) {}

  get isValid(): boolean {
    return isDefined(this.id);
  }

  static all<E extends Enum>(): List<E> {
    return meta(this.allTuple<E>()).values<E>();
  }

  static filter<E extends Enum>(p: (value: E, index: number, array: E[]) => unknown, params?: unknown): List<E> {
    return this.all<E>().filter(p, params);
  }

  static first<E extends Enum>(p?: (value: E, index: number, array: E[]) => unknown, params?: unknown): E {
    return this.all<E>().first(p, params);
  }

  static byIds<E extends Enum>(ids: Id[] = []): List<E> {
    return toList(ids)
      .mapDefined(id => this.byId<E>(id))
      .distinct();
  }

  static byId<E extends Enum>(id: Id, alt?: Get<E, unknown>): E {
    return this.allTuple<E>()[id] ?? ofGet(alt);
  }

  protected static allTuple<E extends Enum>(): Record<Id, E> {
    return meta(this).get(`all-${this.name}`) ?? meta(this).set(`all-${this.name}`, meta(this).values<E>().filter(isEnum).toObject('id'));
  }

  equals<E extends Enum>(other: E | Id): other is E {
    return this.id === (isEnum(other) ? other.id : other);
  }

  isIn<E extends Enum>(...items: E[] | Id[]): boolean {
    return items.some(i => this.equals(i));
  }

  toJSON(): JsonValue {
    return this.id;
  }

  toString(): string {
    return this.id.toString();
  }
}

export const isEnum: TypeGuard<Enum> = (e?: unknown): e is Enum => isDefined(e) && e instanceof Enum && isAn<Enum>(e, 'name', 'id', 'code');
