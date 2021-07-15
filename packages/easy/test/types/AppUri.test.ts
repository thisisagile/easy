import { AppUri } from '../../src';
import { UseCase } from '../../src';
import { URL } from 'url';

describe('AppUri', () => {
  test('Route local and not local works.', () => {
    expect(AppUri.App.uc(UseCase.Login).toString()).toBe('/main');
    expect(AppUri.App.uc(UseCase.Login, new URL('http://localhost:8080')).toString()).toBe('http://localhost:8080/main');
  });

  test('Route Uc matches.', () => {
    expect(AppUri.Uc.uc(UseCase.ForgotPassword)).toMatchRoute('/main/forgot-password');
  });

  test('Route Uc with id matches.', () => {
    expect(AppUri.UcAndId.uc(UseCase.ForgotPassword).id(42)).toMatchRoute('/main/forgot-password/42');
  });

  test('Full route uc with id matches.', () => {
    const res = AppUri.UcAndId.uc(UseCase.Login).id(42).toString();
    expect(res).toBe('/accounts/manage-account/42');
  });
});
