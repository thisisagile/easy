import { Struct } from './Struct';
import { ctx, Id, isDefined, Json } from '../types';
import { required, valid } from '../validation';
import { choose } from '../utils';
import { DateTime } from './values';

export class Audit extends Struct {
  @required() readonly by: { id: Id; name: string } = { id: this.state.by.id, name: this.state.by.name };
  @valid() readonly when: DateTime = new DateTime(this.state.when);

  constructor(a?: Json) {
    super(
      choose(a)
        .case(isDefined, (j: Json) => j)
        .else({ by: ctx.request?.identity ?? { id: 0, name: 'easy' }, when: DateTime.now.toJSON() }),
    );
  }
}
