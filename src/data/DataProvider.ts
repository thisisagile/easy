import { Json, List } from '../types';
import { Query } from './Query';

export interface DataProvider {
  query: (q: Query) => Promise<List<Json>>;
  command: (q: Query) => Promise<number>;
}
