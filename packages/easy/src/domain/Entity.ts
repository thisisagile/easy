import { Struct } from './Struct';
import { Audit } from './Audit';
import { required } from '../validation/Contraints';
import { Id, toId } from '../types/Id';
import { json, Json } from '../types/Json';

export abstract class Entity extends Struct {
  @required() readonly id: Id = this.state.id ?? toId();
  @required() readonly created: Audit = new Audit(this.state.created);
  @required() readonly lastModified: Audit = new Audit(this.state.lastModified);

  protected merge(a: unknown): Json {
    return json.merge(this, a, {
      id: this.id,
      created: this.created,
      lastModified: new Audit(),
    });
  }
}
