import { isNotEmpty, text, Value } from '../../types';
import { isSlug } from 'validator';

export class Slug extends Value {
  constructor(slug?: unknown) {
    super(text(slug).strictKebab.toString());
  }

  get isValid(): boolean {
    return isNotEmpty(this.value) && isSlug(this.value);
  }
}

export const toSlug = (slug?: unknown): Slug => new Slug(slug);