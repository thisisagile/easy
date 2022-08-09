import { Struct } from './Struct';
import { choose, ctx, Id, Json } from '../types';
import { required, valid } from '../validation';
import { DateTime } from './values';

export class Audit extends Struct {
  @required() readonly by: { id: Id; user: string } = { id: this.state.by.id, user: this.state.by.user };
  @valid() readonly when: DateTime = new DateTime(this.state.when);

  constructor(json?: Json) {
    super(
      choose(json)
        .is.defined(j => j, j => j)
        .else({ by: ctx.request?.identity ?? { id: 0, user: 'easy' }, when: DateTime.now.toJSON() }),
    );
  }
}
