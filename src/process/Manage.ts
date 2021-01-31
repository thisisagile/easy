import { Search } from './Search';
import { Struct } from '../domain';
import { Id, Json } from '../types';

export class Manage<T extends Struct> extends Search<T> {
  add = (json: Json): Promise<T> => this.repo.add(json);
  update = (json: Json): Promise<T> => this.repo.update(json);
  remove = (id: Id): Promise<number> => this.repo.remove(id);
}
