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

  test('all', () => {
    expect(Language.all()).toHaveLength(3);
    expect(Language.all()[0]).toBeInstanceOf(Language);
  });

  test('all with inherited enum', () => {
    // const ps = meta(MoreLanguage).values<MoreLanguage>().filter(p => isEnum(p));
    expect(MoreLanguage.all()).toHaveLength(4);
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

  test('toString', () => {
    expect(Language.Java.toString()).toBe('java');
    expect(MoreLanguage.Delphi.toString()).toBe('delphi');
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
