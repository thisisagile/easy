import { Id, Json, JsonValue } from "../types";
import { Query } from "./Query";

export interface Gateway {

  // Queries

  all(): Promise<Json[]>;
  by(key: string, value: JsonValue): Promise<Json[]>;
  byId(id: Id): Promise<Json>;
  find(query: Query): Promise<Json[]>;
  search(q: JsonValue): Promise<Json[]>;
  exists(id: Id): Promise<boolean>;

  // Commands

  add(item: Json): Promise<Json>;
  update(item: Json): Promise<Json>;
  remove(id: Id): Promise<boolean>;

  // Meta

  count(query?: Query): Promise<number>;
  groupBy(...queries: Query[]): Promise<Json[]>;
}
