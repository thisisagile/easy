import { Enum as EasyEnum } from '../types/Enum';
import { lazyRegistry, type Registry } from '../types/Registry';

export class Enum extends EasyEnum {
  constructor(name: string) {
    super(name, name.toLowerCase(), name.toUpperCase());
  }
}

export const create = (name: string): Enum => new Enum(name);

export const Get = /* @__PURE__ */ new Enum('Get');
export const Put = /* @__PURE__ */ new Enum('Put');
export const Patch = /* @__PURE__ */ new Enum('Patch');
export const Post = /* @__PURE__ */ new Enum('Post');
export const Delete = /* @__PURE__ */ new Enum('Delete');

const registry = /* @__PURE__ */ lazyRegistry(() => ({ Get, Put, Patch, Post, Delete }));
export const all: Registry<Enum>['all'] = () => registry.all();
export const byId: Registry<Enum>['byId'] = (id, alt) => registry.byId(id, alt);
export const byIds: Registry<Enum>['byIds'] = ids => registry.byIds(ids);
export const filter: Registry<Enum>['filter'] = (predicate, params) => registry.filter(predicate, params);
export const first: Registry<Enum>['first'] = (predicate, params) => registry.first(predicate, params);
