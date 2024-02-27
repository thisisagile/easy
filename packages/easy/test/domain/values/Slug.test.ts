import { slug, Slug } from '../../../src';
import '@thisisagile/easy-test';

const sl: unknown = 'this-is-a-slug';
const slWithSpaces: unknown = 'this is a slug   ';
const slWithUppercase: unknown = 'thIs iS a sLug   ';

describe('Slug', () => {
  test('invalid', () => {
    expect(new Slug('')).not.toBeValid();
    expect(new Slug(' ')).not.toBeValid();
    expect(slug({})).not.toBeValid();
    expect(slug(slWithSpaces).value).not.toBeValid();
  });

  test('valid', () => {
    expect(slug(sl)).toBeValid();
    expect(slug(slWithSpaces)).toBeValid();
    expect(slug(slWithUppercase)).toBeValid();
  });

  test('trims spaces and kebab on construction', () => {
    expect(slug(slWithSpaces).value).toStrictEqual(sl);
    expect(slug(' also a slug').value).toBe('also-a-slug');
    expect(slug(' A slug & it"s special? characters! ').value).toBe('a-slug-it-s-special-characters');
    expect(slug(slWithUppercase).value).toStrictEqual(sl);
  });
});
