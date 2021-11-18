import { Enum } from '../../src';
import { Language } from '../ref';
import '@thisisagile/easy-test';

describe('Enum', () => {
  class MoreLanguage extends Language {
    static readonly Delphi = new Language('Delphi');
    text = () => this.name;
  }

  test('Is constructed correctly with name only', () => {
    expect(Language.Java.name).toBe('Java');
    expect(Language.Java.id).toBe('java');
    expect(Language.Java.code).toBe(Language.Java.id);
  });

  test('Is constructed correctly', () => {
    expect(Language.JavaScript.name).toBe('JavaScript');
    expect(Language.JavaScript.id).toBe('javascript');
    expect(Language.JavaScript.code).toBe('js');
  });

  test('byIds', () => {
    const ids = ['javascript', 'typescript', 'java'];
    const idsWithWrongOnes = ['javascript', 'typescript', 'java', 'php', 'english'];
    const sameIds =  ['typescript', 'typescript', 'typescript'];
    expect(Language.byIds()).toHaveLength(0);
    expect(Language.byIds(ids)).toHaveLength(3);
    expect(Language.byIds(idsWithWrongOnes)).toHaveLength(3);
    expect(Language.byIds(sameIds)).toHaveLength(1);
    expect(Language.byIds(ids)[0]).toBeInstanceOf(Language);
  });

  test('all', () => {
    expect(Language.all()).toHaveLength(4);
    expect(Language.all()[0]).toBeInstanceOf(Language);
  });

  test('all with inherited enum', () => {
    expect(MoreLanguage.all()).toHaveLength(5);
    expect(MoreLanguage.all()[3]).toBeInstanceOf(Language);
  });

  test('by works', () => {
    expect(MoreLanguage.byId('java')).toBeDefined();
    expect(MoreLanguage.byId('delphi')).toBeDefined();
    expect(MoreLanguage.byId('c')).toBeUndefined();
    expect(MoreLanguage.byId('delphi', MoreLanguage.JavaScript)).toMatchObject(MoreLanguage.Delphi);
    expect(MoreLanguage.byId('c', MoreLanguage.JavaScript)).toMatchObject(MoreLanguage.JavaScript);
    expect(MoreLanguage.byId('c', () => MoreLanguage.JavaScript)).toMatchObject(MoreLanguage.JavaScript);
  });

  test('filter works', () => {
    expect(Language.filter(l => l === MoreLanguage.Delphi)).toHaveLength(0);
    expect(MoreLanguage.filter(ml => ml === Language.Java)).toHaveLength(1);
    expect(MoreLanguage.filter(ml => ml === Language.Java)).toContain(Language.Java);
    expect(MoreLanguage.filter(ml => ml === Language.Java || ml === MoreLanguage.Delphi)).toHaveLength(2);
    expect(MoreLanguage.filter((ml, i) => ml === Language.Java || i === 0)).toHaveLength(2);
    expect(MoreLanguage.filter((ml, i, a) => ml === Language.Java || i === 0 || a !== undefined)).toHaveLength(5);
  });

  test('toString', () => {
    expect(Language.Java).toMatchText('java');
    expect(MoreLanguage.Delphi).toMatchText('delphi');
  });

  test('toJSON', () => {
    expect(Language.Java.toJSON()).toMatchText(Language.Java.id);
  });

  test('isValid', () => {
    expect(Language.Java).toBeValid();
    expect(MoreLanguage.Delphi).toBeValid();
    expect(MoreLanguage.byId(Language.JavaScript.id)).toBeValid();
    expect(MoreLanguage.byId('HTML')).not.toBeValid();
    expect(MoreLanguage.byId('HTML', Language.Java)).toBeValid();
  });

  test('equals', () => {
    expect(Language.Java.equals('java')).toBeTruthy();
    expect(Language.Java.equals(Language.Java)).toBeTruthy();
    expect(Language.Java.equals('javascript')).toBeFalsy();
    expect(Language.Java.equals(Language.JavaScript)).toBeFalsy();
  });
});
