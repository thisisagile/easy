import { Query } from './Query';
import { Json, List } from '../types';

export interface DataProvider {
  query: (q: Query) => Promise<List<Json>>;
  command: (q: Query) => Promise<number>;
}
