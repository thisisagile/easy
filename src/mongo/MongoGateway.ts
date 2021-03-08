import { Exception, Gateway, Id, isDefined, Json, JsonValue, List } from '../types';
import { reject } from '../utils';
import { MongoProvider } from './MongoProvider';

export class MongoGateway implements Gateway {
  constructor(protected readonly collection: string, protected readonly provider: MongoProvider = new MongoProvider(collection)) {}

  all(): Promise<List<Json>> {
    return this.provider.all();
  }

  byId(id: Id): Promise<Json> {
    return this.provider.byId(id);
  }

  search(q: JsonValue): Promise<List<Json>> {
    return reject(Exception.IsNotImplemented);
  }

  exists(id: Id): Promise<boolean> {
    return this.provider.byId(id).then(i => isDefined(i));
  }

  add(item: Json): Promise<Json> {
    return this.provider.add(item);
  }

  update(item: Json): Promise<Json> {
    return this.provider.update(item);
  }

  remove(id: Id): Promise<void> {
    return this.provider.remove(id);
  }
}
