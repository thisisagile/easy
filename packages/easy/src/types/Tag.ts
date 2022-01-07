import { meta } from './Meta';

export const tag =
  (name: string): PropertyDecorator =>
  (subject: unknown, property: string | symbol): void => {
    meta(subject).property(property).set(name, property);
  };

export const searchable = (): PropertyDecorator => tag(searchable.name);
