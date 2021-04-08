import { Json, List } from '../types';
import { Query } from './Query';

export type DataProvider = any;

export interface SqlProvider extends DataProvider {
  query: (q: Query) => Promise<List<Json>>;
  command: (q: Query) => Promise<number>;
}
