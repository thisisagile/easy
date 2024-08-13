import { asString, isText, kebab, replaceAll, Text, text, toJson } from '../../src';
import { Dev } from '../ref';
import '@thisisagile/easy-test';

describe('isText', () => {
  const has = { toString: 3 };

  test('correct', () => {
    expect(isText()).toBeFalsy();
    expect(isText(null)).toBeFalsy();
    expect(isText(3)).toBeTruthy();
    expect(isText(has)).toBeFalsy();
    expect(isText({})).toBeTruthy();
    expect(isText('Hello')).toBeTruthy();
    expect(isText(Dev.Jeroen)).toBeTruthy();
  });

  test('ifText without alt', () => {
    expect(asString()).toBe('');
    expect(asString('hallo')).toBe('hallo');
    expect(asString(Dev.Jeroen)).toBe('Jeroen');
  });

  test('ifText with alt', () => {
    expect(asString(undefined, 'alt')).toBe('alt');
    expect(asString(undefined, () => 'alt')).toBe('alt');
    expect(asString(has, () => 'alt')).toBe('alt');
    expect(asString('hallo', 'alt')).toBe('hallo');
    expect(asString(Dev.Jeroen, Dev.Naoufal)).toBe('Jeroen');
  });

  const replaceAll = (origin: Text, search: Text, replace: Text = ''): string => origin.toString().split(search.toString()).join(replace.toString());

  test('replaceAll', () => {
    expect(replaceAll('Hello', 'alt', '')).toBe('Hello');
    expect(replaceAll('Hello', 'alt', '')).toBe('Hello');
    expect(replaceAll('Hello', 'ello', 'alt')).toBe('Halt');
    expect(replaceAll('Hello hello', 'ello', 'alt')).toBe('Halt halt');
    expect(replaceAll('Hello hello', 'ello')).toBe('H h');
    expect(replaceAll(Dev.Naoufal, 'Na', 'Ja')).toBe('Jaoufal');
    expect(replaceAll(Dev.Naoufal, Dev.Naoufal, Dev.Jeroen)).toBe(Dev.Jeroen.name);
  });

  test('with', () => {
    expect(text().with('')).toMatchText('');
    expect(text('First').with('')).toMatchText('First');
    expect(text('First').with('s')).toMatchText('First');
    expect(text('First').with('', 'Second')).toMatchText('FirstSecond');
    expect(text('First').with('-', 'Second')).toMatchText('First-Second');
    expect(text('First').with('-', 'Second', 'Third')).toMatchText('First-Second-Third');
    expect(text(Dev.Rob).with('-', Dev.Jeroen, Dev.Sander)).toMatchText('Rob-Jeroen-Sander');
    expect(text(Dev.Rob).with('-', '', Dev.Sander)).toMatchText('Rob-Sander');
  });

  test('cap', () => {
    expect(text().cap).toMatchText('');
    expect(text('sander').cap).toMatchText('Sander');
    expect(text('Sander').cap).toMatchText('Sander');
    expect(text('SANder').cap).toMatchText('Sander');
    expect(text('sander de wit').cap).toMatchText('Sander de wit');
  });

  test('title', () => {
    expect(text().title).toMatchText('');
    expect(text('sander').title).toMatchText('Sander');
    expect(text('Sander').title).toMatchText('Sander');
    expect(text('SANder').title).toMatchText('Sander');
    expect(text('sander de bruin').title).toMatchText('Sander De Bruin');
  });

  test('capFirst', () => {
    expect(text().capFirst).toMatchText('');
    expect(text('sander').capFirst).toMatchText('Sander');
    expect(text('Sander').capFirst).toMatchText('Sander');
    expect(text('SANder').capFirst).toMatchText('SANder');
    expect(text('sander de blauw').capFirst).toMatchText('Sander de blauw');
  });

  test('toJSON', () => {
    const name = text('Sander');
    const dev = { name };
    expect(toJson(dev)).toMatchObject({ name: 'Sander' });
  });
});

describe('kebab', () => {
  test('empty', () => {
    expect(kebab()).toBe('');
  });

  const cases = [
    ['', ''],
    ['a', 'a'],
    ['a.b', 'a-b'],
    ['a@b', 'a-b'],
    ['a-b', 'a-b'],
    ['a--b', 'a-b'],
    ['a------b', 'a-b'],
    ['a---,&---b', 'a-b'],
    ['héél', 'h-l'],
    ['{{hallo}}', 'hallo'],
    ['---hallo---', 'hallo'],
    ['camelCase', 'camel-case'],
    ['snake_case', 'snake-case'],
    ['kebab-case', 'kebab-case'],
    ['UPPER_SNAKE_CASE', 'upper-snake-case'],
    ['TitleCase', 'title-case'],
  ];

  test.each(cases)('to kebab "%s"', (t, exp) => {
    expect(kebab(t)).toBe(exp);
  });
});
