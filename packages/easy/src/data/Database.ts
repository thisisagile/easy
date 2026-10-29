import { DataProvider } from './DataProvider';
import { Enum as EasyEnum } from '../types/Enum';
import { lazyRegistry, type Registry } from '../types/Registry';
import { Construct, ofConstruct } from '../types/Constructor';

export type DatabaseOptions = {
  user?: string;
  password?: string;
  host?: string;
  port?: number;
  cluster?: string;
  connectionString?: string;
  maxPoolSize?: number;
  minPoolSize?: number;
  maxIdleTimeMS?: number;
  socketTimeoutMS?: number;
  // Query specific options
  queryTimeoutMS?: number;
  // Cloud-specific options
  projectId?: string;
};

export class DefaultProvider implements DataProvider {}

export class Enum extends EasyEnum {
  constructor(
    name: string,
    readonly provider: Construct<DataProvider>,
    readonly options?: DatabaseOptions
  ) {
    super(name);
  }

  provide = <P>(): P => ofConstruct(this.provider, this);
}

export const create = (name: string, provider: Construct<DataProvider>, options?: DatabaseOptions): Enum => new Enum(name, provider, options);

export const Default = /* @__PURE__ */ create('Default', DefaultProvider);

const registry = /* @__PURE__ */ lazyRegistry(() => ({ Default }));
export const all: Registry<Enum>['all'] = () => registry.all();
export const byId: Registry<Enum>['byId'] = (id, alt) => registry.byId(id, alt);
export const byIds: Registry<Enum>['byIds'] = ids => registry.byIds(ids);
export const filter: Registry<Enum>['filter'] = (predicate, params) => registry.filter(predicate, params);
export const first: Registry<Enum>['first'] = (predicate, params) => registry.first(predicate, params);
