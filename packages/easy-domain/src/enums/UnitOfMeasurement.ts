import { Enum as EasyEnum } from '@thisisagile/easy/types/Enum';
import { lazyRegistry, type Registry } from '@thisisagile/easy/types/Registry';

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

const registry = /* @__PURE__ */ lazyRegistry(() => ({ MM, CM, DM, M, KM }));
export const all: Registry<Enum>['all'] = () => registry.all();
export const byId: Registry<Enum>['byId'] = (id, alt) => registry.byId(id, alt);
export const byIds: Registry<Enum>['byIds'] = ids => registry.byIds(ids);
export const filter: Registry<Enum>['filter'] = (predicate, params) => registry.filter(predicate, params);
export const first: Registry<Enum>['first'] = (predicate, params) => registry.first(predicate, params);
