import "reflect-metadata";
import { isDefined } from "../types";

class ClassMeta {
  constructor(readonly subject: any, private readonly data: any = (subject.prototype ?? subject).constructor) {}

  get = <T>(key: string): T => Reflect.getMetadata(key, this.data) as T;

  set = <T>(key: string, value: T): T => {
    Reflect.defineMetadata(key, value, this.data);
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
  constructor(readonly subject: unknown, readonly property: string, private readonly data = Reflect.getMetadata(property, subject)) {}

  get = <T>(key: string): T => isDefined(this.data) && isDefined(this.data[key]) ? this.data[key] as T : undefined;

  set = <T>(key: string, value: T): T => {
    Reflect.defineMetadata(this.property, { ...this.data, [key]: value }, this.subject);
    return value;
  };
}

export const meta = (subject: unknown): ClassMeta => new ClassMeta(subject ?? {});
