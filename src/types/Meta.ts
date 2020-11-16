import 'reflect-metadata';
import { list, List } from './List';
import { isDefined } from './Is';

class ClassMeta {
  constructor(readonly subject: any, private readonly data: any = (subject.prototype ?? subject).constructor) {}

  get = <T>(key: string): T => Reflect.getMetadata(key, this.data) as T;

  set = <T>(key: string, value: T): T => {
    Reflect.defineMetadata(key, value, this.data);
    return value;
  };

  properties = (key?: string): List<PropertyMeta> =>
    list([...Object.getOwnPropertyNames(this.subject), ...Object.getOwnPropertyNames(Object.getPrototypeOf(this.subject))])
      .map(p => this.property(p))
      .filter(p => key ? p.get(key) : p);

  keys = <T = any>(key: string): List<T> =>
    this.properties().map(p => p.get<T>(key)).filter(v => isDefined(v));

  values = () => this.properties().map(p => p.value);

  property = (property: string): PropertyMeta => new PropertyMeta(this.subject, property);
}

class PropertyMeta {
  constructor(readonly subject: unknown, readonly property: string, private readonly data = Reflect.getMetadata(property, subject)) {}

  get value(): any { return (this.subject as any)[this.property]; }

  get = <T>(key: string): T => isDefined(this.data) && isDefined(this.data[key]) ? this.data[key] as T : undefined;

  set = <T>(key: string, value: T): T => {
    Reflect.defineMetadata(this.property, { ...this.data, [key]: value }, this.subject);
    return value;
  };
}

export const meta = (subject: unknown): ClassMeta => new ClassMeta(subject ?? {});
