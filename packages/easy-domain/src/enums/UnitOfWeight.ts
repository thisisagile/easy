import { Enum as EasyEnum } from '@thisisagile/easy/types/Enum';
import { lazyRegistry, type Registry } from '@thisisagile/easy/types/Registry';

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

const registry = /* @__PURE__ */ lazyRegistry(() => ({ MG, G, KG }));
export const all: Registry<Enum>['all'] = () => registry.all();
export const byId: Registry<Enum>['byId'] = (id, alt) => registry.byId(id, alt);
export const byIds: Registry<Enum>['byIds'] = ids => registry.byIds(ids);
export const filter: Registry<Enum>['filter'] = (predicate, params) => registry.filter(predicate, params);
export const first: Registry<Enum>['first'] = (predicate, params) => registry.first(predicate, params);
