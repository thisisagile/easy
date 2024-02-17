import { toUrl } from '../src';
import { App, UseCase } from '@thisisagile/easy';

describe('Tester', () => {
  const host = 'http://localhost:9999';
  const uc = new UseCase(App.Main, 'Review Code', 'Review');

  test('toUrl works', () => {
    expect(toUrl(uc)).toMatch('/main/review');
  });

  test('toUrl with host works', () => {
    expect(toUrl(uc, host)).toMatch('http://localhost:9999/main/review');
  });

  test('toUrl with id works', () => {
    expect(toUrl(uc, '', 42)).toMatch('/main/review/42');
  });
});
