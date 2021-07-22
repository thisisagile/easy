import { toBeAt, Tester } from '../../src';
import { mock } from '@thisisagile/easy-test';

describe('toBeAt', () => {
  let tester: Tester;
  const loginUrl = 'http://localhost/main/login';

  beforeEach(() => {
    tester = mock.empty<Tester>();
  });

  test('passes', () => {
    tester.url = loginUrl;
    expect(toBeAt(tester, loginUrl)).toPassMatcherWith(`Tester is at '${loginUrl}'`);
  });

  test('fails tester undefined', () => {
    expect(toBeAt()).toFailMatcherWith(`Tester is undefined`);
  });

  test('fails tester.url undefined', () => {
    expect(toBeAt(tester, 'http://localhost')).toFailMatcherWith(`We expected to be at: 'http://localhost', but are at: 'undefined' instead.`);
  });

  test('fails url undefined', () => {
    tester.url = loginUrl;
    expect(toBeAt(tester)).toFailMatcherWith(`We expected to be at: 'undefined', but are at: '${loginUrl}' instead.`);
  });

  test('fails tester.url not at url', () => {
    tester.url = loginUrl;
    expect(toBeAt(tester, 'http://localhost/main')).toFailMatcherWith(`We expected to be at: 'http://localhost/main', but are at: '${loginUrl}' instead.`);
  });
});
