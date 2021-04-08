import { Enum } from '../types';
import { DataProvider } from './DataProvider';

export type DatabaseOptions = {
  user?: string;
  password?: string;
  host?: string;
  port?: number;
  connectionString?: string;
};

export class Database extends Enum {
  constructor(name: string, readonly provider: DataProvider, options?: DatabaseOptions) {
    super(name);
  }

  static readonly Main = new Database('Main', ({} as unknown) as DataProvider);
}
