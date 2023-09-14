import { Search } from './Search';
import { FetchOptions, Id, Json } from '../types';

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
