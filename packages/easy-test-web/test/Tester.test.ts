import { toUrl } from '../src';
import { UseCase } from '@thisisagile/easy';

describe('Tester', () => {
  const host = 'http://localhost';
  const port = 9999;

  test('toUrl works', () => {
    const uc = UseCase.Login;
    expect(toUrl(uc)).toMatch('/main/login');
  });

  test('toUrl with host works', () => {
    const uc = UseCase.Login;
    expect(toUrl(uc, host)).toMatch('http://localhost/main/login');
  });

  test('toUrl with host and port works', () => {
    const uc = UseCase.Login;
    expect(toUrl(uc, host, port)).toMatch('http://localhost:9999/main/login');
  });

  test('toUrl with id works', () => {
    const uc = UseCase.Login;
    expect(toUrl(uc, '', undefined, 42)).toMatch('/main/login/42');
  });
});
