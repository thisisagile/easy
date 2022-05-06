import { Repo, Struct } from '../domain';
import { choose, Id, isNotEmpty, JsonValue, Key, toList, TotalList } from '../types';
import { resolve } from '../utils';

export class Search<T extends Struct> {
  constructor(protected repo: Repo<T>) {
  }

  all = (): Promise<TotalList<T>> => this.repo.all();

  byId = (id: Id): Promise<T> => this.repo.byId(id);

  byIds = (...ids: Id[]): Promise<TotalList<T>> => this.repo.byIds(...ids);

  byKey = (key: Key): Promise<TotalList<T>> => this.repo.byKey(key);

  search = (query: JsonValue): Promise<TotalList<T>> =>
    choose(query)
      .case(isNotEmpty, q => this.repo.search(q))
      .else(resolve(toList<T>()));

  exists = (id: Id): Promise<boolean> => this.repo.exists(id);
}
