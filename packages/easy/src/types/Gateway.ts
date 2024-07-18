import { Json, JsonValue } from './Json';
import { Id } from './Id';
import { Exception } from './Exception';
import { PageList, PageOptions } from './PageList';
import { List } from './List';
import { Optional } from './Types';
import { reject } from '../utils/Promise';

export type FetchOptions = PageOptions;

export abstract class Gateway<Options = FetchOptions> {
  all(options?: Options): Promise<PageList<Json>> {
    return reject(Exception.IsNotImplemented);
  }

  byId(id: Id, options?: Options): Promise<Optional<Json>> {
    return reject(Exception.IsNotImplemented);
  }

  by(_key: string, _value: JsonValue, _options?: Options): Promise<PageList<Json>> {
    return reject(Exception.IsNotImplemented);
  }

  byIds(..._ids: Id[]): Promise<List<Json>> {
    return reject(Exception.IsNotImplemented);
  }

  search(q: JsonValue, options?: Options): Promise<PageList<Json>> {
    return reject(Exception.IsNotImplemented);
  }

  filter(options?: Options): Promise<PageList<Json>> {
    return reject(Exception.IsNotImplemented);
  }

  exists(id: Id, options?: Options): Promise<boolean> {
    return reject(Exception.IsNotImplemented);
  }

  add(item: Json, options?: Options): Promise<Json> {
    return reject(Exception.IsNotImplemented);
  }

  update(item: Json, options?: Options): Promise<Json> {
    return reject(Exception.IsNotImplemented);
  }

  remove(id: Id, options?: Options): Promise<boolean> {
    return reject(Exception.IsNotImplemented);
  }
}
