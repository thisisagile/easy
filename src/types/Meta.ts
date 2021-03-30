import 'reflect-metadata';
import { List, toList } from './List';
import { isDefined } from './Is';

class ClassMeta {
  constructor(readonly subject: any, private readonly data: any = (subject.prototype ?? subject).constructor) {}

  get = <T>(key: string): T => Reflect.getMetadata(key, this.data) as T;

  set = <T>(key: string, value: T): T => {
    Reflect.defineMetadata(key, value, this.data);
    return value;
  };

  entries = <T = unknown>(): List<[key: string, value: T]> =>
    toList([...Object.entries(this.subject), ...Object.entries(Object.getPrototypeOf(this.subject))]) as List<[any, T]>;

  properties = (key?: string): List<PropertyMeta> =>
    toList([...Object.getOwnPropertyNames(this.subject), ...Object.getOwnPropertyNames(Object.getPrototypeOf(this.subject))])
      .map(p => this.property(p))
      .filter(p => (key ? p.get(key) : p));

  keys = <T = any>(key: string): List<T> =>
    this.properties()
      .map(p => p.get<T>(key))
      .reduce((list, u) => (u ? list.add(u) : list), toList<T>());

  values = () => this.properties().map(p => p.value);

  property = (property: string | symbol): PropertyMeta => new PropertyMeta(this.subject, property);
}

class PropertyMeta {
  constructor(readonly subject: any, readonly property: string | symbol, private readonly data = Reflect.getMetadata(property, subject)) {}

  get value(): any {
    return this.subject[this.property];
  }

  get = <T>(key: string): T | undefined => (isDefined(this.data) && isDefined(this.data[key]) ? (this.data[key] as T) : undefined);

  set = <T>(key: string, value: T): T => {
    Reflect.defineMetadata(this.property, { ...this.data, [key]: value }, this.subject);
    return value;
  };
}

export const meta = (subject: unknown): ClassMeta => new ClassMeta(subject ?? {});
