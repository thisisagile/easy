import { MongoProvider } from './MongoProvider';
import {
  asJson,
  Condition,
  Field,
  Gateway,
  Id,
  ifDefined,
  isDefined,
  Json,
  JsonValue,
  LogicalCondition, PageList,
} from '@thisisagile/easy';
import { Collection } from './Collection';

export class MongoGateway implements Gateway {
  constructor(readonly collection: Collection, readonly provider: MongoProvider = collection.provider) {
  }

  all(): Promise<PageList<Json>> {
    return this.provider.all().then(l => l.map(j => this.collection.in(j)));
  }

  byId(id: Id): Promise<Json | undefined> {
    return this.provider.byId(id).then(j => ifDefined(j, this.collection.in(j)));
  }

  by(key: string, value: JsonValue): Promise<PageList<Json>> {
    return this.provider.by(key, value).then(l => l.map(j => this.collection.in(j)));
  }

  byIds(...ids: Id[]): Promise<PageList<Json>> {
    return this.find((this.collection.id as Field).isIn(...ids));
  }

  find(q: JsonValue | Condition | LogicalCondition): Promise<PageList<Json>> {
    return this.provider.find(asJson(q)).then(l => l.map(j => this.collection.in(j)));
  }

  search(q: JsonValue): Promise<PageList<Json>> {
    return this.find(this.collection.google(q));
  }

  exists(id: Id): Promise<boolean> {
    return this.provider.byId(id).then(i => isDefined(i));
  }

  add(item: Json): Promise<Json> {
    return this.provider.add(this.collection.out(item)).then(j => this.collection.in(j));
  }

  update(item: Json): Promise<Json> {
    return this.provider.update(this.collection.out(item)).then(j => this.collection.in(j));
  }

  remove(id: Id): Promise<boolean> {
    return this.provider.remove(id);
  }
}
