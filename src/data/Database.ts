import { Enum, Get } from '../types';
import { DataProvider } from './DataProvider';

export type DatabaseOptions = {
  user?: string;
  password?: string;
  host?: string;
  port?: number;
  connectionString?: string;
};

export class Database<P extends DataProvider = DataProvider> extends Enum {
  static readonly Main = new Database('Main', () => (({} as unknown) as DataProvider));

  constructor(name: string, readonly provider: () => Get<P>, readonly options?: DatabaseOptions) {
    super(name);
  }
}
