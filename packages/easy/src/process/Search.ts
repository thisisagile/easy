import { Repo, Struct } from '../domain';
import { choose, Id, JsonValue, Key, PageList, PageOptions, toList } from '../types';
import { resolve } from '../utils';
import { Req } from '../resources';

export class Search<T extends Struct> {
  constructor(protected repo: Repo<T>) {
  }

  all = (options?: PageOptions): Promise<PageList<T>> => this.repo.all(options);

  byId = (id: Id): Promise<T> => this.repo.byId(id);

  byIds = (...ids: Id[]): Promise<PageList<T>> => this.repo.byIds(...ids);

  byKey = (key: Key, options?: PageOptions): Promise<PageList<T>> => this.repo.byKey(key, options);

  query = ({ query, skip, take }: Req): Promise<PageList<T>> => this.search(query, { skip, take });

  search = (query: JsonValue, options?: PageOptions): Promise<PageList<T>> =>
    choose(query)
      .is.not.empty(q => q, q => this.repo.search(q, options))
      .else(resolve(toList<T>()));

  exists = (id: Id): Promise<boolean> => this.repo.exists(id);
}
