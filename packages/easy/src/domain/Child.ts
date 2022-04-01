import { Struct } from './Struct';
import { Id, json, Json, toId } from '../types';
import { required } from '../validation';

export abstract class Child extends Struct {
  @required() readonly id: Id = this.state.id ?? toId();
  protected merge = (a: unknown): Json => json.merge(this, a, { id: this.id });
  // protected merge = (a: unknown): Json => json.parse({ ...this, ...{ a as any }, id: this.id });
}
