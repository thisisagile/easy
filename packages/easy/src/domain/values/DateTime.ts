import { isDefined, Value } from '../../types';
import moment from 'moment';
import { ifDefined } from '../../utils';

export class DateTime extends Value<string | undefined> {
  constructor(value: string | number | Date) {
    super(ifDefined(value, moment(value, true).toISOString()));
  }

  static get now(): DateTime {
    return new DateTime(moment().toISOString());
  }

  get fromNow(): string {
    return this.value ? moment(this.value).fromNow() : '';
  }

  get isValid(): boolean {
    return isDefined(this.value) && moment(this.value, true).isValid();
  }

  toString(): string {
    return this.value ?? '';
  }
}
