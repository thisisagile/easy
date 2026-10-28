import Exception from '../../src/entries/Exception';
import { Dev, Language } from '../ref';
import '@thisisagile/easy-test';

describe('Exception', () => {
  const message = 'This is wrong';
  const exc = Exception.create(message);
  const exc2 = Exception.create(message);

  test('name and id are set properly', () => {
    expect(exc.message).toBe(message);
    expect(exc.id).toBe('ThisIsWrong');
    expect(exc.name).toBe(message);
    expect(Exception.AlreadyExists.id).toBe('SubjectAlreadyExists');
  });

  test('isException', () => {
    expect(Exception.isException()).toBeFalsy();
    expect(Exception.isException(exc)).toBeTruthy();
    expect(Exception.isException(Dev.Naoufal)).toBeFalsy();
  });

  test('isException with text', () => {
    expect(Exception.isException(exc, '')).toBeFalsy();
    expect(Exception.isException(exc, message)).toBeFalsy();
    expect(Exception.isException(exc, 'ThisIsWrong')).toBeTruthy();
    expect(Exception.isException(exc, Dev.Naoufal)).toBeFalsy();
    expect(Exception.isException(exc, Exception.DoesNotExist)).toBeFalsy();
    expect(Exception.isException(exc, exc2)).toBeTruthy();
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

  test('environment variable is not found', () => {
    expect(Exception.EnvironmentVariableNotFound('Hoi').message).toBe('Environment variable HOI could not be found.');
  });

  test('queries the explicit catalogue', () => {
    expect(Exception.byId(Exception.Unknown.id)).toBe(Exception.Unknown);
    expect(Exception.byIds([Exception.DoesNotExist.id])).toEqual([Exception.DoesNotExist]);
  });

  test('is an Exception.DoesNotExist', () => {
    expect(Exception.isDoesNotExist()).toBeFalsy();
    expect(Exception.isDoesNotExist({})).toBeFalsy();
    expect(Exception.isDoesNotExist(Dev.Naoufal)).toBeFalsy();
    expect(Exception.isDoesNotExist(Exception.IsNotImplemented)).toBeFalsy();
    expect(Exception.isDoesNotExist(Exception.DoesNotExist)).toBeTruthy();
    expect(Exception.isDoesNotExist(Exception.DoesNotExist.because('Not sure'))).toBeTruthy();
  });
});
