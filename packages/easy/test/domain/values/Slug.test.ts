import { toSlug, Slug } from '../../../src';
import '@thisisagile/easy-test';

const sl = 'this-is-a-slug';
const slWithSpaces = 'this is a slug   ';
const slWithUppercase = 'thIs iS a sLug   ';

describe('Slug', () => {
  test('invalid', () => {
    expect(new Slug(undefined)).not.toBeValid();
    expect(new Slug('')).not.toBeValid();
    expect(new Slug(' ')).not.toBeValid();
    expect(toSlug(slWithSpaces).value).not.toBeValid();
  });

  test('valid', () => {
    expect(toSlug(sl)).toBeValid();
    expect(toSlug(slWithSpaces)).toBeValid();
    expect(toSlug(slWithUppercase)).toBeValid();
  });

  test('trims spaces and kebab on construction', () => {
    expect(toSlug(slWithSpaces).value).toStrictEqual(sl);
    expect(toSlug(' also a slug').value).toBe('also-a-slug');
    expect(toSlug(' A slug & it"s special? characters! ').value).toBe('a-slug-it-s-special-characters');
    expect(toSlug(slWithUppercase).value).toStrictEqual(sl);
  });
});
