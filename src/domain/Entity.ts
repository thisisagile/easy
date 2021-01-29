import { Record } from './Record';
import { Id, Json, toJson } from '../types';
import { required } from '../validation';

export abstract class Entity extends Record {
  @required() readonly id: Id = this.state.id;

  /**
   * @deprecated add parameter, use merge instead
   */
  toJSON(add: Json = {}): Json {
    return typeof add !== "string" ? toJson({ ...this, ...add, id: this.id, state: undefined }) : toJson({ ...this, state: undefined });
  }

  protected merge = (a: Json): Json => ({ ...toJson(this), ...a, id: this.id });
}

export const isEntity = (e?: unknown): e is Entity => e instanceof Entity;
