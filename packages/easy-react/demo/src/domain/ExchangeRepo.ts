import { Currency, Gateway, List, Repo, resolve } from '@thisisagile/easy';
import { Exchange } from './Exchange';

export class ExchangeRepo extends Repo<Exchange> {
  constructor() {
    super(Exchange, {} as Gateway);
  }
  all = (): Promise<List<Exchange>> => resolve(Currency.all()).then(cs => cs.map(c => new Exchange({ source: Currency.EUR.id, target: c.id, rate: 0.9 })));
}
