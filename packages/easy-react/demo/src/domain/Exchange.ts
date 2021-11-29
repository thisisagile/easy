import { Currency, required, Struct } from '@thisisagile/easy';

export class Exchange extends Struct {
  @required() readonly source: Currency = Currency.byId(this.state.source);
  @required() readonly target: Currency = Currency.byId(this.state.target);
  @required() readonly rate: number = this.state.rate;
}
