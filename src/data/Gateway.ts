import { Id, Json, JsonValue } from "../types";
import { Query } from "./Query";
import { List } from '../utils';

export interface Gateway {

  // Queries

  all(): Promise<List<Json>>;
  by(key: string, value: JsonValue): Promise<List<Json>>;
  byId(id: Id): Promise<Json>;
  find(query: Query): Promise<List<Json>>;
  search(q: JsonValue): Promise<List<Json>>;
  exists(id: Id): Promise<boolean>;

  // Commands

  add(item: Json): Promise<Json>;
  update(item: Json): Promise<Json>;
  remove(id: Id): Promise<boolean>;

  // Meta

  count(query?: Query): Promise<number>;
}
