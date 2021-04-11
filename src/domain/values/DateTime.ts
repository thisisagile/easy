import { Value } from '../../types';
import moment from 'moment';

export class DateTime extends Value {
  constructor(value?: string | number | Date) {
    super(moment(value).isValid() ? moment(value).toISOString() : '');
  }

  static get now(): DateTime {
    return new DateTime();
  }
}
