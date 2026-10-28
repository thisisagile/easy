import { lazyRegistry } from '../types/Registry';
import { Enum as Scope } from './Scope';

export class Enum extends Scope {
  constructor(name: string) {
    super(name);
  }
}

export const create = (name: string): Enum => new Enum(name);

export const Main = /* @__PURE__ */ create('Main');

export const { all, byId, byIds, filter, first } = /* @__PURE__ */ lazyRegistry(() => ({ Main }));
