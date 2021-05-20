import { Value } from '../../types';
import moment from 'moment';

export class DateTime extends Value {
  constructor(value: string | number | Date) {
    super(value && moment(value, true).isValid() ? moment(value).toISOString() : '');
  }

  static get now(): DateTime {
    return new DateTime(moment().toISOString());
  }

  get fromNow(): string {
    return moment(this.value).fromNow();
  }

  get isValid(): boolean {
    return moment(this.value, true).isValid();
  }
}
