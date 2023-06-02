import { asString, isEmpty, text, Value } from '../../types';
import validateEmail from 'validator/lib/isEmail';

export class Email extends Value {
  constructor(email?: unknown) {
    super(asString(email).trim().toLowerCase());
  }

  get isValid(): boolean {
    return isEmail(this.value);
  }

  get name(): string {
    return text(this.value.split('@')[0]).replace('.', ' ').title.toString();
  }
}

export const email = (email?: unknown): Email => new Email(email);

export const isEmail = (e?: unknown): boolean => !isEmpty(e) && validateEmail(asString(e));
