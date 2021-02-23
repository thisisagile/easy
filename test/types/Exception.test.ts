import {Exception, isException} from '../../src/types/Exception';
import {Dev, Language} from '../ref';

describe('Exception', () => {

  const exc = new Exception('This is wrong');
  const exc2 = new Exception('This is wrong');

  test('name and id are set properly', () => {
    expect(exc.message).toBe('This is wrong');
    expect(exc.id).toBe('ThisIsWrong');
    expect(exc.name).toBe('This is wrong');
  });

  test('isException', () => {
    expect(isException()).toBeFalsy();
    expect(isException(exc)).toBeTruthy();
    expect(isException(Dev.Naoufal)).toBeFalsy();
  });

  test('isException with text', () => {
    expect(isException(exc, '')).toBeFalsy();
    expect(isException(exc, 'This is wrong')).toBeFalsy();
    expect(isException(exc, 'ThisIsWrong')).toBeTruthy();
    expect(isException(exc, Dev.Naoufal)).toBeFalsy();
    expect(isException(exc, Exception.DoesNotExist)).toBeFalsy();
    expect(isException(exc, exc2)).toBeTruthy();
  });

  test('equals', () => {
    expect(exc.equals('')).toBeFalsy();
    expect(exc.equals('Does not exist')).toBeFalsy();
    expect(exc.equals(Language.Java)).toBeFalsy();
    expect(exc.equals(Exception.DoesNotExist)).toBeFalsy();
    expect(exc.equals(exc2)).toBeTruthy();
  });
});