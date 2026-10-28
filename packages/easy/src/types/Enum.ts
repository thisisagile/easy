import { Id } from './Id';
import { isAn } from './IsA';
import { isDefined } from './Is';
import { Validatable } from './Validatable';
import { JsonValue } from './Json';
import { TypeGuard } from './TypeGuard';

export abstract class Enum implements Validatable {
  protected constructor(
    readonly name: string,
    readonly id: Id = name.toLowerCase(),
    readonly code: string = id.toString()
  ) {}

  get isValid(): boolean {
    return isDefined(this.id);
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
