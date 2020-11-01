import {isDefined, isEmpty, isInstance, isObject} from "class-validator";
import {Constructor} from "../types/Constructor";
import {isValidatable} from "../types/Validatable";
import {Enum} from "../types/Enum";
import {Entity} from "../domain/Entity";

class Is {
    constructor(readonly value?: unknown, readonly isValid = true) {}

    get a(): IsAType { return new IsAType(this.value, this.isValid); }

    get an(): IsAnType { return new IsAnType(this.value, this.isValid); }

    get not(): Is {return new Is(this.value, !this.isValid); }

    get defined(): boolean { return this.and(v => isDefined(v)).isValid; }

    get empty(): boolean { return this.and(v => isEmpty(v)).isValid; }

    get validatable(): boolean { return this.and(v => isValidatable(v)).isValid; }

    and = (and: (value: unknown) => boolean): Is => new Is(this.value, this.isValid && and(this.value));
}

class IsAnType extends Is {
    get object(): boolean { return this.and(v => isObject(v)).isValid; }

    get enum(): boolean { return this.and(v => v instanceof Enum).isValid; }

    get entity(): boolean { return this.and(v => v instanceof Entity).isValid; }

    instanceOf = <T>(ctor: Constructor<T>): boolean => this.and(v => isInstance(v, ctor)).isValid;
}

class IsAType extends Is {
}

export const is = (value?: unknown): Is => new Is(value);
