import { List } from './List';
import { Json, JsonValue } from './Json';
import { Id } from './Id';

export interface Gateway {
  all: () => Promise<List<Json>>;
  byId: (id: Id) => Promise<Json | undefined>;
  by: (key: string, value: JsonValue) => Promise<List<Json>>;
  search: (q: JsonValue) => Promise<List<Json>>;
  exists: (id: Id) => Promise<boolean>;

  add: (item: Json) => Promise<Json>;
  update: (item: Json) => Promise<Json>;
  remove: (id: Id) => Promise<boolean>;
}
