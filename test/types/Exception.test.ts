import {Exception, isException} from '../../src/types/Exception';
import {Dev} from '../ref';

describe('Exception', () => {

  const exc = new Exception('This is wrong');

  test('name and id are set properly', () => {
    expect(exc.message).toBe('This is wrong');
    expect(exc.id).toBe('ThisIsWrong');
    expect(exc.name).toBe('This is wrong');
  });

  test('isException', () => {
    expect(isException()).toBeFalsy();
    expect(isException(exc)).toBeTruthy();
    expect(isException(Dev.Naoufal)).toBeFalsy();
  })

  test('isException with text', () => {
    expect(isException(exc, '')).toBeFalsy();
    expect(isException(exc, 'This is wrong')).toBeFalsy();
    expect(isException(exc, 'ThisIsWrong')).toBeTruthy();
    expect(isException(exc, Dev.Naoufal)).toBeFalsy();
    expect(isException(exc, Exception.DoesNotExist)).toBeFalsy();
    expect(isException(exc, exc)).toBeTruthy();
  })
});