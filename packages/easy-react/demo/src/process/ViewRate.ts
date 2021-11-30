import { Manage } from '@thisisagile/easy';
import { ExchangeRepo } from '../domain/ExchangeRepo';
import { Exchange } from '../domain/Exchange';

export class ViewRate extends Manage<Exchange> {
  constructor(readonly rates = new ExchangeRepo()) {
    super(rates);
  }
}
