import { FetchOptions } from '../types/Gateway';
import { Repository } from '../types/Repository';
import { PageList, toPageList } from '../types/PageList';
import { Id, Key } from '../types/Id';
import { List } from '../types/List';
import { Req } from '../resources/Req';
import { JsonValue } from '../types/Json';
import { choose } from '../types/Case';
import { resolve } from '../utils/Promise';

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
