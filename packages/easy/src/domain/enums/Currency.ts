import { Enum } from '../../types';

export class Currency extends Enum {
  static readonly EUR = new Currency('EUR');
  static readonly USD = new Currency('USD');
}