import { Enum as EasyEnum } from '../types/Enum';
import { lazyRegistry } from '../types/Registry';

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

export const { all, byId, byIds, filter, first } = /* @__PURE__ */ lazyRegistry(() => ({ Get, Put, Patch, Post, Delete }));
