import { choose, FetchOptions, Id, JsonValue, Key, List, PageList, Repository, toPageList } from '../types';
import { resolve } from '../utils';
import { Req } from '../resources';

export class Search<T, Options = FetchOptions> {
  constructor(protected repo: Repository<T, Options>) {}

  all(options?: Options): Promise<PageList<T>> {
    return this.repo.all(options);
  }

  byId(id: Id): Promise<T> {
    return this.repo.byId(id);
  }

  byIds(...ids: Id[]): Promise<List<T>> {
    return this.repo.byIds(...ids);
  }

  byKey(key: Key, options?: Options): Promise<PageList<T>> {
    return this.repo.byKey(key, options);
  }

  query({ query, skip, take }: Req): Promise<PageList<T>> {
    return this.search(query, { skip, take } as Options);
  }

  search(query: JsonValue, options?: Options): Promise<PageList<T>> {
    return choose(query)
      .is.not.empty(
        q => q,
        q => this.repo.search(q, options)
      )
      .else(() => resolve(toPageList<T>()));
  }

  filter(options?: Options): Promise<PageList<T>> {
    return this.repo.filter(options);
  }

  exists(id: Id): Promise<boolean> {
    return this.repo.exists(id);
  }
}
