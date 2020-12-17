import { Record } from './Record';
import { Id, Json, toJson } from '../types';
import { required } from '../validation';

export abstract class Entity extends Record {
  @required() readonly id: Id = this.state.id;

  toJSON(add: Json = {}): Json {
    return toJson({ ...this, ...add, id: this.state.id, state: undefined });
  }
}

export const isEntity = (e?: unknown): e is Entity => e instanceof Entity;
