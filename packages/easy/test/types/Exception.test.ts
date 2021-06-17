import { Exception, isException } from '../../src';
import { Dev, Language } from '../ref';

describe('Exception', () => {
  const message = 'This is wrong';
  const exc = new Exception(message);
  const exc2 = new Exception(message);

  test('name and id are set properly', () => {
    expect(exc.message).toBe(message);
    expect(exc.id).toBe('ThisIsWrong');
    expect(exc.name).toBe(message);
    expect(Exception.AlreadyExists.id).toBe('SubjectAlreadyExists');
  });

  test('isException', () => {
    expect(isException()).toBeFalsy();
    expect(isException(exc)).toBeTruthy();
    expect(isException(Dev.Naoufal)).toBeFalsy();
  });

  test('isException with text', () => {
    expect(isException(exc, '')).toBeFalsy();
    expect(isException(exc, message)).toBeFalsy();
    expect(isException(exc, 'ThisIsWrong')).toBeTruthy();
    expect(isException(exc, Dev.Naoufal)).toBeFalsy();
    expect(isException(exc, Exception.DoesNotExist)).toBeFalsy();
    expect(isException(exc, exc2)).toBeTruthy();
  });

  test('equals', () => {
    expect(exc.equals('')).toBeFalsy();
    expect(exc.equals(message)).toBeFalsy();
    expect(exc.equals(Language.Java)).toBeFalsy();
    expect(exc.equals(Exception.DoesNotExist)).toBeFalsy();
    expect(exc.equals(exc2)).toBeTruthy();
  });

  test('adding additional error', () => {
    expect(Exception.DoesNotExist.because('Bad parameter').reason).toBe('Bad parameter');
    expect(Exception.DoesNotExist.reason).toBeUndefined();
    expect(Exception.DoesNotExist.equals(Exception.DoesNotExist)).toBeTruthy();
    expect(Exception.DoesNotExist.because('Bad parameters').id).toBe(Exception.DoesNotExist.id);
    expect(Exception.DoesNotExist.because('Bad haircut').equals(Exception.DoesNotExist)).toBeTruthy();
  });
});
