import { Gateway, Id, isDefined, Json, JsonValue, List, toList } from '../types';
import { when } from '../validation';

export class CollectionGateway implements Gateway {
  constructor(readonly name: string, private data: Promise<List<Json>>) {}

  add(item: Json): Promise<Json> {
    return this.data.then(d => d.add(item)).then(() => ({ ...item }));
  }

  all(): Promise<List<Json>> {
    return this.data.then(d => toList(d));
  }

  byId(id: Id): Promise<Json> {
    return this.data.then(d => d.first(i => i.id === id)).then(d => (d ? { ...d } : undefined));
  }

  exists(id: Id): Promise<boolean> {
    return this.byId(id).then(d => isDefined(d));
  }

  remove(id: Id): Promise<void> {
    return this.data.then(d =>
      when(d.findIndex(i => i.id === id))
        .with(i => i < 0)
        .reject()
        .then(i => d.splice(i, 1))
        .then()
    );
  }

  search(_q: JsonValue): Promise<List<Json>> {
    return Promise.reject();
  }

  update(item: Json): Promise<Json> {
    return this.remove(item.id as Id).then(() => this.add(item));
  }
}
