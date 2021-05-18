import { MongoProvider } from './MongoProvider';
import { asJson, Collection, Condition, Gateway, Id, isDefined, Json, JsonValue, List } from '@thisisagile/easy';

export class MongoGateway implements Gateway {
  constructor(readonly collection: Collection, readonly provider: MongoProvider = new collection.db.provider(collection)) {}

  all(): Promise<List<Json>> {
    return this.provider.all();
  }

  byId(id: Id): Promise<Json | undefined> {
    return this.provider.byId(id);
  }

  by(key: string, value: JsonValue): Promise<List<Json>> {
    return this.provider.by(key, value);
  }

  find(q: JsonValue | Condition): Promise<List<Json>> {
    return this.provider.find(asJson(q));
  }

  search(q: JsonValue): Promise<List<Json>> {
    return this.find(this.collection.google(q));
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

  remove(id: Id): Promise<boolean> {
    return this.provider.remove(id);
  }
}
