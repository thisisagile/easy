import { toUrl } from '../src';
import { UseCase } from '@thisisagile/easy';

describe('ReactTestElement', () => {
  test('toUrl works', () => {
    const uc = UseCase.Login;
    expect(toUrl(uc)).toMatch('/main/login');
  });

  test('toUrl with host works', () => {
    const uc = UseCase.Login;
    expect(toUrl(uc, 'http://localhost')).toMatch('http://localhost/main/login');
  });

  test('toUrl with host and port works', () => {
    const uc = UseCase.Login;
    expect(toUrl(uc, 'http://localhost', 8080)).toMatch('http://localhost:8080/main/login');
  });

  test('toUrl with id works', () => {
    const uc = UseCase.Login;
    expect(toUrl(uc, '', undefined, 42)).toMatch('/main/login/42');
  });
});
