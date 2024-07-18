import { Struct } from './Struct';
import { required } from '../validation/Contraints';
import { Id, toId } from '../types/Id';
import { json, Json } from '../types/Json';

export abstract class Child extends Struct {
  @required() readonly id: Id = this.state.id ?? toId();

  protected merge(a: unknown): Json {
    return json.merge(this, a, { id: this.id });
  }
}
