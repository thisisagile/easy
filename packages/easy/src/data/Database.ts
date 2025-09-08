import { DataProvider } from './DataProvider';
import { Enum } from '../types/Enum';
import { Constructor, ofConstruct } from '../types/Constructor';

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
};

export class DefaultProvider implements DataProvider {}

export class Database extends Enum {
  static readonly Default = new Database('Default', DefaultProvider);

  constructor(
    name: string,
    readonly provider: Constructor<DataProvider> | DataProvider,
    readonly options?: DatabaseOptions
  ) {
    super(name);
  }

  provide = <P>(): P => ofConstruct(this.provider, this);
}
