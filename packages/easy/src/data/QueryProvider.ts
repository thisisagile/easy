import { Query } from './Query';
import { DataProvider } from './DataProvider';
import { List } from '../types/List';
import { Json } from '../types/Json';

export interface QueryProvider extends DataProvider {
  query: (q: Query) => Promise<List<Json>>;
  command: (q: Query) => Promise<number>;
}
