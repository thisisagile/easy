import { Struct } from './Struct';
import { DateTime } from './DateTime';
import { required, valid } from '../validation/Contraints';
import { Identity } from '../types/Identity';
import { Json } from '../types/Json';
import { choose } from '../types/Case';
import { isIdentity } from '../types/IsA';
import { ctx } from '../types/Context';

export class Audit extends Struct {
  @required() readonly by: Identity = { id: this.state.by?.id, user: this.state.by?.user };
  @valid() readonly when: DateTime = new DateTime(this.state.when);

  constructor(json?: Json) {
    super(
      choose(json)
        .is.defined(
          j => j,
          j => j
        )
        .else({
          by: isIdentity(ctx.request?.identity) ? ctx.request?.identity : { id: 0, user: 'easy' },
          when: DateTime.now.toJSON(),
        })
    );
  }
}
