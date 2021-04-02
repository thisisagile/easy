import { Value } from '../types';
import moment from 'moment';

export class DateTime extends Value {
  constructor(v?: string | number | Date) {
    super(moment(v).isValid() ? moment(v).toISOString() : '');
  }

  static get now(): DateTime {
    return new DateTime();
  }
}
