import { Repo, Struct } from '../domain';
import { choose, Id, isNotEmpty, JsonValue, Key, toList, TotalledList } from '../types';
import { resolve } from '../utils';

export class Search<T extends Struct> {
  constructor(protected repo: Repo<T>) {
  }

  all = (): Promise<TotalledList<T>> => this.repo.all();

  byId = (id: Id): Promise<T> => this.repo.byId(id);

  byIds = (...ids: Id[]): Promise<TotalledList<T>> => this.repo.byIds(...ids);

  byKey = (key: Key): Promise<TotalledList<T>> => this.repo.byKey(key);

  search = (query: JsonValue): Promise<TotalledList<T>> =>
    choose(query)
      .case(isNotEmpty, q => this.repo.search(q))
      .else(resolve(toList<T>()));

  exists = (id: Id): Promise<boolean> => this.repo.exists(id);
}
