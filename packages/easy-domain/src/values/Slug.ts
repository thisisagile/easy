import { isNotEmpty, text, Value } from '@thisisagile/easy';
import { isSlug } from 'validator';

export class Slug extends Value {
  constructor(slug?: unknown) {
    super(text(slug).slug.toString());
  }

  get isValid(): boolean {
    return isNotEmpty(this.value) && isSlug(this.value);
  }
}

export const toSlug = (slug?: unknown): Slug => new Slug(slug);
