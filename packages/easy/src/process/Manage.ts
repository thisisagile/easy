import { Search } from './Search';
import { FetchOptions } from '../types/Gateway';
import { Json } from '../types/Json';
import { Id } from '../types/Id';

export class Manage<T, Options = FetchOptions> extends Search<T, Options> {
  add(json: Json): Promise<T> {
    return this.repo.add(json);
  }

  update(id: Id, json: Json): Promise<T> {
    return this.repo.update(id, json);
  }

  upsert(id: Id, json: Json): Promise<T> {
    return this.repo.upsert(id, json);
  }

  remove(id: Id): Promise<boolean> {
    return this.repo.remove(id);
  }
}
