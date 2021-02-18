import { Struct } from './Struct';
import { Id, json, Json, toId } from '../types';
import { required } from '../validation';

export abstract class Entity extends Struct {
  @required() readonly id: Id = this.state.id ?? toId();

  protected merge = (a: Json): Json => json.parse({ ...this, ...a, id: this.id });
}

export const isEntity = (e?: unknown): e is Entity => e instanceof Entity;
