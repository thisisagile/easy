import { Query } from './Query';
import { Json, List } from '../types';
import { DataProvider } from './DataProvider';

export interface QueryProvider extends DataProvider {
  query: (q: Query) => Promise<List<Json>>;
  command: (q: Query) => Promise<number>;
}
