import { toBeAt, Tester } from '../../src';
import { mock } from '@thisisagile/easy-test';
import { App, UseCase } from '@thisisagile/easy';

describe('toBeAt', () => {
  let tester: Tester;
  let loginUrl: string ;
  let uc : UseCase

  beforeEach(() => {
    loginUrl = 'http://localhost:999/main/login';

    tester = mock.empty<Tester>({domain: 'http://localhost', port: '999', url: loginUrl});

    uc = new UseCase(App.Main, 'login')
  });

  test('passes', () => {
    expect(toBeAt(tester, uc)).toPassMatcherWith(`Tester is at '${loginUrl}'`);
  });

  test('passes with uc and id', () => {
    tester.url = 'http://localhost:999/main/profile/1';
    uc = new UseCase(App.Main, 'profile')
    expect(toBeAt(tester, uc, 1)).toPassMatcherWith(`Tester is at '${ tester.url}'`);
  });

  test('fails tester undefined', () => {
    expect(toBeAt()).toFailMatcherWith(`Tester is undefined`);
  });

  test('fails uc undefined', () => {
    tester.url = loginUrl;
    expect(toBeAt(tester)).toFailMatcherWith(`uc is undefined`);
  });

  test('fails tester.url not at uc url', () => {
    tester.url = 'http://localhost/foo/bar';
    expect(toBeAt(tester, uc)).toFailMatcherWith(`We expected to be at: 'http://localhost:999/main/login', but are at: '${tester.url}' instead.`);
  });
});
