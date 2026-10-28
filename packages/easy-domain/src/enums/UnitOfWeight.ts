import { Enum as EasyEnum } from '@thisisagile/easy/types/Enum';
import { lazyRegistry } from '@thisisagile/easy/types/Registry';

export class Enum extends EasyEnum {
  constructor(
    name: string,
    id: string,
    readonly gMultiplier: number
  ) {
    super(name, id);
  }
}

export const create = (name: string, id: string, gMultiplier: number): Enum => new Enum(name, id, gMultiplier);

export const MG = /* @__PURE__ */ new Enum('MilliGram', 'mg', 0.001);
export const G = /* @__PURE__ */ new Enum('Gram', 'g', 1);
export const KG = /* @__PURE__ */ new Enum('Kilogram', 'kg', 1000);

export const { all, byId, byIds, filter, first } = /* @__PURE__ */ lazyRegistry(() => ({ MG, G, KG }));
