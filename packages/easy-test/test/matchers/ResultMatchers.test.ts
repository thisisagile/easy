import { toFail, toFailWith, toResultWith } from '../../src';
import { Results } from '../../src/utils/Types';

const ok: Results = { isValid: true, results: [{ message: 'Fine' }] };
const notOk: Results = { isValid: false, results: [{ message: 'Did not work' }] };

describe('Testing ResultsMatcher', () => {
  test('Failed works', () => {
    expect(toFail(ok)).not.toPassMatcher();
    expect(toFail(notOk)).toPassMatcher();
  });

  test('Succeed with works', () => {
    expect(toResultWith(notOk, 'Fine')).not.toPassMatcherWith('Fine');
    expect(toResultWith(ok, 'Not fine')).not.toPassMatcherWith('Not fine');
    expect(toResultWith(ok, 'Fine')).toPassMatcher();
    expect(toResultWith(ok, 'Fine')).toPassMatcherWith('Succeeds with message Fine, which we did not expect.');
  });

  test('Failure works', () => {
    expect(toFail(ok)).toFailMatcher();
    expect(toFail(notOk)).toPassMatcherWith('Results does not fail, which we did not expect.');
  });

  test('Fail with', () => {
    expect(toFailWith(ok, '')).toFailMatcher();
    expect(toFailWith(notOk, 'Wrong')).toFailMatcherWith(`Fails, but results does not have message 'Wrong', but it has messages 'Did not work' instead.`);
    expect(toFailWith(notOk, 'Did not work')).toPassMatcherWith(`Fails with message 'Did not work', which we did not expect.`);
  });
});
