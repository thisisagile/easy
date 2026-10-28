import { Enum as EasyEnum } from '@thisisagile/easy/types/Enum';
import { lazyRegistry } from '@thisisagile/easy/types/Registry';

export class Enum extends EasyEnum {
  constructor(
    name: string,
    id: string,
    readonly mmMultiplier: number
  ) {
    super(name, id);
  }
}

export const create = (name: string, id: string, mmMultiplier: number): Enum => new Enum(name, id, mmMultiplier);

export const MM = /* @__PURE__ */ new Enum('Millimeter', 'mm', 1);
export const CM = /* @__PURE__ */ new Enum('Centimeter', 'cm', 10);
export const DM = /* @__PURE__ */ new Enum('Decimeter', 'dm', 100);
export const M = /* @__PURE__ */ new Enum('Meter', 'm', 1000);
export const KM = /* @__PURE__ */ new Enum('Kilometer', 'km', 1000000);

export const { all, byId, byIds, filter, first } = /* @__PURE__ */ lazyRegistry(() => ({ MM, CM, DM, M, KM }));
