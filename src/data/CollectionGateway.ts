import { Gateway, Id, Json, JsonValue, List, toList } from '../types';

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
    return this.data.then(d => d.filter(i => i.id === id)).then(d => !!d?.[0]);
  }

  remove(id: Id): Promise<number> {
    return this.data
      .then(d => {
        const i = d.findIndex(i => i.id === id);
        return i > -1 ? d.splice(i, 1) : [];
      })
      .then(d => d.length);
  }

  search(_q: JsonValue): Promise<List<Json>> {
    return Promise.reject();
  }

  update(item: Json): Promise<Json> {
    return this.remove(item.id as Id).then(r => (r ? this.add(item) : Promise.reject()));
  }
}
