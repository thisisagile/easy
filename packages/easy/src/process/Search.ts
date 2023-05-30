import { choose, FetchOptions, Id, JsonValue, Key, List, PageList, Repository, toPageList } from '../types';
import { resolve } from '../utils';
import { Req } from '../resources';

export class Search<T, Options = FetchOptions> {
  constructor(protected repo: Repository<T, Options>) {}

  all = (options?: Options): Promise<PageList<T>> => this.repo.all(options);

  byId = (id: Id): Promise<T> => this.repo.byId(id);

  byIds = (...ids: Id[]): Promise<List<T>> => this.repo.byIds(...ids);

  byKey = (key: Key, options?: Options): Promise<PageList<T>> => this.repo.byKey(key, options);

  query = ({ query, skip, take }: Req): Promise<PageList<T>> => this.search(query, { skip, take } as Options);

  search = (query: JsonValue, options?: Options): Promise<PageList<T>> =>
    choose(query)
      .is.not.empty(
        q => q,
        q => this.repo.search(q, options)
      )
      .else(() => resolve(toPageList<T>()));

  filter = (options?: Options): Promise<PageList<T>> => this.repo.filter(options);

  exists = (id: Id): Promise<boolean> => this.repo.exists(id);
}
