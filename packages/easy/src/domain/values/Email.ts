import { asString, isEmpty, text, Value } from '../../types';
import validator from 'validator';

export class Email extends Value {
  constructor(email?: unknown) {
    super(asString(email));
  }

  get isValid(): boolean {
    return isEmail(this.value);
  }

  get name(): string {
    return text(this.value.split('@')[0]).replace('.', ' ').title.toString();
  }
}

export const email = (email?: unknown): Email => new Email(email);


export const isEmail = (email?: unknown): boolean => {
  return !isEmpty(email) && validator.isEmail(asString(email));
};
