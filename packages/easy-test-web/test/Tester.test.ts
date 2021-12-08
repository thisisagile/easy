import { toUrl } from '../src';
import { DevUseCase } from '@thisisagile/easy/test/ref/DevUseCase';

describe('Tester', () => {
  const host = 'http://localhost:9999';

  test('toUrl works', () => {
    const uc = DevUseCase.WriteCode;
    expect(toUrl(uc)).toMatch('/main/write-code');
  });

  test('toUrl with host works', () => {
    const uc = DevUseCase.WriteCode;
    expect(toUrl(uc, host)).toMatch('http://localhost:9999/main/write-code');
  });

  test('toUrl with id works', () => {
    const uc = DevUseCase.WriteCode;
    expect(toUrl(uc, '', 42)).toMatch('/main/write-code/42');
  });
});
