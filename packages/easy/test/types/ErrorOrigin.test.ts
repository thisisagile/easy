import '@thisisagile/easy-test';
import { errorMessage, Exception, HttpStatus, rest, toResult, toResults } from '../../src';

describe('errorMessage', () => {
  test('extracts the first error message from a service Response', () => {
    const r = { status: HttpStatus.BadRequest, body: rest.toError(HttpStatus.BadRequest, [toResult(`Taxonomy '42' already exists`)]) };
    expect(errorMessage(r)).toBe(`Taxonomy '42' already exists`);
  });

  test('falls back to body.error.message when errors is empty', () => {
    const r = { status: HttpStatus.BadRequest, body: { error: { code: 400, message: 'Something wrong', errors: [], errorCount: 0 } } };
    expect(errorMessage(r)).toBe('Something wrong');
  });

  test('extracts reason from an Exception', () => {
    expect(errorMessage(Exception.IsNotValid.because('Blocked by rule'))).toBe('Blocked by rule');
  });

  test('falls back to Exception.message when no reason', () => {
    expect(errorMessage(Exception.DoesNotExist)).toBe(Exception.DoesNotExist.message);
  });

  test('extracts the first message from Results', () => {
    expect(errorMessage(toResults('Boom', 'Later'))).toBe('Boom');
  });

  test('falls back to Error.message', () => {
    expect(errorMessage(new Error('Boom'))).toBe('Boom');
  });

  test('returns strings as-is', () => {
    expect(errorMessage('Just a string')).toBe('Just a string');
  });

  test('returns undefined when nothing matches', () => {
    expect(errorMessage({})).toBeUndefined();
    expect(errorMessage(undefined)).toBeUndefined();
  });
});
