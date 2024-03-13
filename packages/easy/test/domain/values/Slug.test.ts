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
    expect(toSlug(' A slug & it"s special? characters™!      ').value).toBe('a-slug-it-s-special-characterstm');
    expect(toSlug('this-is a!-slug... ').value).toBe(sl);
    expect(toSlug('       -!!!!this--- -is - &&a& &  ----slug!-... ').value).toBe(sl);
    expect(toSlug('this-is-a-slug').value).toBe(sl);
    expect(toSlug(slWithUppercase).value).toStrictEqual(sl);
  });

  test('replaces diacritics with regular characters', () => {
    expect(toSlug('é').value).toBe('e');
    expect(toSlug('éè & ëê').value).toBe('ee-ee');
    expect(toSlug('áà $%^ äâ').value).toBe('aa-aa');
    expect(toSlug('óòöô').value).toBe('oooo');
    expect(toSlug('úùüû').value).toBe('uuuu');
    expect(toSlug('íìïî').value).toBe('iiii');
    expect(toSlug('ññññ').value).toBe('nnnn');
    expect(toSlug('çççç').value).toBe('cccc');
    expect(toSlug('ßßßß').value).toBe('ssssssss');
  });
});
