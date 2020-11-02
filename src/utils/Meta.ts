import "reflect-metadata";
import { isDefined } from "../types";

class ClassMeta {
  constructor(readonly subject: any, private readonly meta: any = (subject.prototype ?? subject).constructor) {}

  get = <T>(key: string): T => Reflect.getMetadata(key, this.meta) as T;

  set = <T>(key: string, value: T): T => {
    Reflect.defineMetadata(key, value, this.meta);
    return value;
  };

  properties = (): PropertyMeta[] =>
    [...Object.getOwnPropertyNames(this.subject), ...Object.getOwnPropertyNames(Object.getPrototypeOf(this.subject))]
      .map(p => this.property(p));

  keys = <T = any>(key: string): T[] =>
    this.properties().map(p => p.get<T>(key)).filter(v => isDefined(v));


  property = (property: string): PropertyMeta => new PropertyMeta(this.subject, property);
}

class PropertyMeta {
  constructor(readonly subject: unknown, readonly property: string, private readonly meta = Reflect.getMetadata(property, subject)) {}

  get = <T>(key: string): T => isDefined(this.meta) && isDefined(this.meta[key]) ? this.meta[key] as T : undefined;

  set = <T>(key: string, value: T): T => {
    Reflect.defineMetadata(this.property, { ...this.meta, [key]: value }, this.subject);
    return value;
  };
}

export const meta = (subject: unknown): ClassMeta => new ClassMeta(subject ?? {});
