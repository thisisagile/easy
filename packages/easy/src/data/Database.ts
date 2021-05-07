import { Constructor, Enum } from '../types';
import { DataProvider } from './DataProvider';

export type DatabaseOptions = {
  user?: string;
  password?: string;
  host?: string;
  port?: number;
  cluster?: string;
  connectionString?: string;
};

export class DefaultProvider implements DataProvider {}

export class Database extends Enum {
  static readonly Default = new Database('Default', DefaultProvider);

  constructor(name: string, readonly provider: Constructor<DataProvider>, readonly options?: DatabaseOptions) {
    super(name);
  }

  provide = <P>(): P => new this.provider(this) as P;
}
