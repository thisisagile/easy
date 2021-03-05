import { Query } from '../data';

export class MongoQuery implements Query {
  constructor(readonly query: string) {}
}
export const mongo = (q: string): MongoQuery => new MongoQuery(q);
