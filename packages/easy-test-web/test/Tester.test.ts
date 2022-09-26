import { toUrl } from '../src';
import { DevUseCase } from '@thisisagile/easy/test/ref/DevUseCase';

describe('Tester', () => {
  const host = 'http://localhost:9999';

  test('toUrl works', () => {
    const uc = DevUseCase.ReviewCode;
    expect(toUrl(uc)).toMatch('/main/review');
  });

  test('toUrl with host works', () => {
    const uc = DevUseCase.ReviewCode;
    expect(toUrl(uc, host)).toMatch('http://localhost:9999/main/review');
  });

  test('toUrl with id works', () => {
    const uc = DevUseCase.ReviewCode;
    expect(toUrl(uc, '', 42)).toMatch('/main/review/42');
  });
});
