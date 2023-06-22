import { Struct } from './Struct';
import { Id, json, Json, toId } from '../types';
import { required } from '../validation';

export abstract class Child extends Struct {
  @required() readonly id: Id = this.state.id ?? toId();

  protected merge(a: unknown): Json {
    return json.merge(this, a, { id: this.id });
  }
}
