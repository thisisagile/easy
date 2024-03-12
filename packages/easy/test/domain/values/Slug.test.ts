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
    expect(toSlug(' A slug & it"s special? char™acters! ').value).toBe('a-slug-its-special-characters');
    expect(toSlug(slWithUppercase).value).toStrictEqual(sl);
  });

  test('replaces diacritics with regular characters', () => {
    expect(toSlug('éè & ëê').value).toBe('ee-ee');
    expect(toSlug('áà $%^ äâ').value).toBe('aa-aa');
    expect(toSlug('óòöô').value).toBe('oooo');
    expect(toSlug('úùüû').value).toBe('uuuu');
    expect(toSlug('íìïî').value).toBe('iiii');
    expect(toSlug('ñ').value).toBe('n');
    expect(toSlug('ç').value).toBe('c');
    expect(toSlug('ß').value).toBe('ss');
  });
});
