import { Id, Tester, UseCase } from '../utils/Types';
import { isDefined } from '../utils/Utils';
import { match } from './Match';

const toUrl = (uc: UseCase, id?: Id): string => {
  const i = isDefined(id) ? `/${id}` : '';
  return `/${uc.app.id}/${uc.id}${i}`;
};

export const toBeExactlyAt = (tester?: Tester, uc?: UseCase, id?: Id): jest.CustomMatcherResult => {
  return match<Tester>(tester as Tester)
    .undefined(t => t, 'Tester is undefined')
    .undefined(t => t.url, 'Tester does not contain a URL')
    .undefined(() => uc, 'Use case is undefined')
    .not(
      t => t.url.includes(toUrl(uc as UseCase, id)),
      t => `We expected the tester to be at: '${toUrl(uc as UseCase, id)}', but it is at: '${t?.url}' instead.`
    )
    .else(t => `The tester is at '${t?.url}'`);
};

expect.extend({
  toBeExactlyAt,
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R, T> {
      toBeExactlyAt(uc?: UseCase, id?: Id): R;
    }
  }
}
