import { Struct } from './Struct';
import { Id, Json, toJson } from '../types';
import { required } from '../validation';

export abstract class Entity extends Struct {
  @required() readonly id: Id = this.state.id;

  protected merge = (a: Json): Json => toJson(this, a, { id: this.id });
}

export const isEntity = (e?: unknown): e is Entity => e instanceof Entity;
