import { Enum as EasyEnum } from './Enum';
import { lazyRegistry } from './Registry';

export class Enum extends EasyEnum {
  constructor(name: string, id: string) {
    super(name, id);
  }
}

export const create = (name: string, id: string): Enum => new Enum(name, id);

export const Dev = /* @__PURE__ */ new Enum('Development', 'dev');
export const Tst = /* @__PURE__ */ new Enum('Test', 'tst');
export const Acc = /* @__PURE__ */ new Enum('Acceptance', 'acc');
export const Prd = /* @__PURE__ */ new Enum('Production', 'prd');

export const { all, byId, byIds, filter, first } = /* @__PURE__ */ lazyRegistry(() => ({ Dev, Tst, Acc, Prd }));
