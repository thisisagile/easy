import { Enum } from '../types';
import { DataProvider } from './DataProvider';

export class Database extends Enum {
  constructor(name: string, readonly provider?: DataProvider) {
    super(name);
  }
  static readonly Main = new Database('Main');
}
