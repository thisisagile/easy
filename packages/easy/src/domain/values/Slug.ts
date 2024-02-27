import { asString, isDefined, isEmpty, isEmptyObject, kebab, Value } from '../../types';
import { isSlug } from 'validator';

export class Slug extends Value {
  constructor(slug?: unknown) {
    super(isDefined(asString(slug)) && !isEmptyObject(slug) ? kebab(asString(slug)) : '');
  }

  get isValid(): boolean {
    return isSlug(this.value) && !isEmpty(this.value) && !isEmptyObject(this.value);
  }
}

export const slug = (slug?: unknown): Slug => new Slug(slug);