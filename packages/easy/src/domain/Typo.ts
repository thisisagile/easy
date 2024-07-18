import { View } from '../utils/View';
import { FetchOptions, Gateway } from '../types/Gateway';
import { Repository } from '../types/Repository';
import { Json, JsonValue } from '../types/Json';
import { PageList } from '../types/PageList';
import { Id, Key } from '../types/Id';
import { when } from '../validation/When';
import { Exception } from '../types/Exception';
import { List } from '../types/List';

export class Typo<T, Options = FetchOptions> extends Repository<T, Options> {
  constructor(
    protected view: View<T>,
    private readonly gateway: Gateway<Options>
  ) {
    super();
  }

  create = (j: Json): T => this.view.from(j);

  all(options?: Options): Promise<PageList<T>> {
    return this.gateway.all(options).then(js => js.map(this.create));
  }

  byId(id: Id): Promise<T> {
    return this.gateway
      .byId(id)
      .then(j => when(j).not.isDefined.reject(Exception.DoesNotExist))
      .then(j => this.create(j));
  }

  byIds(...ids: Id[]): Promise<List<T>> {
    return this.gateway.byIds(...ids).then(js => js.map(this.create));
  }

  byKey(key: Key, options?: Options): Promise<PageList<T>> {
    return this.gateway.by('key', key, options).then(js => js.map(this.create));
  }

  by(key: keyof T, value: JsonValue, options?: Options): Promise<PageList<T>> {
    return this.gateway.by(key.toString(), value, options).then(js => js.map(this.create));
  }

  search(q: JsonValue, options?: Options): Promise<PageList<T>> {
    return this.gateway.search(q, options).then(js => js.map(this.create));
  }

  filter(options?: Options): Promise<PageList<T>> {
    return this.gateway.filter(options).then(js => js.map(j => this.create(j)));
  }

  exists(id: Id): Promise<boolean> {
    return this.gateway.exists(id);
  }
}
