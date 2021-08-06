import { UseCase, Tester } from '../../src/utils/Types';
import { toBeAt } from '../../src';

describe('toBeAt', () => {

  const tester: Tester = { url: 'http://localhost:1337/profiles/find-profile' };
  const tester2: Tester = { url: undefined as unknown as string };
  const uc : UseCase = { app: {id: 'profiles'}, id: 'find-profile'};
  const uc2 : UseCase = { app: {id: 'shops'}, id: 'manage-shop'};

  test('tester is undefined', () => {
    expect(toBeAt(undefined as unknown as Tester, uc)).toFailMatcherWith('Tester is undefined');
  });

  test('url in tester is undefined', () => {
    expect(toBeAt(tester2, uc)).toFailMatcherWith('Tester does not contain a URL');
  });

  test('uc is undefined', () => {
    expect(toBeAt(tester, undefined as unknown as UseCase)).toFailMatcherWith('Use case is undefined');
  });

  test('uc doesnt match tester', () => {
    expect(toBeAt(tester, uc2)).toFailMatcherWith('We expected the tester to be at: \'/shops/manage-shop\', but it is at: \'http://localhost:1337/profiles/find-profile\' instead.');
  });

  test('uc matches tester', () => {
    expect(toBeAt(tester, uc)).toPassMatcherWith('The tester is at \'http://localhost:1337/profiles/find-profile\', which we did not expect.');
  });

});
