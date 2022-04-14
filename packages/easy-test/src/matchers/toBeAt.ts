import CustomMatcherResult = jest.CustomMatcherResult;
import { Id, Tester, UseCase } from '../utils/Types';
import { match } from './Match';

export const toBeAt = (tester?: Tester, uc?: UseCase, id?: Id): CustomMatcherResult => {
  return match<Tester>(tester as Tester)
    .undefined(t => t, 'Tester is undefined')
    .undefined(t => t.url, 'Tester does not contain a URL')
    .undefined(() => uc, 'Use case is undefined')
    .not(
      t => t.url.includes(`/${uc?.app.id}`),
      t => `We expected the tester to be at app '${uc?.app.id}', but it is at '${t?.url}' instead.`
    )
    .not(
      t => t.url.includes(`/${uc?.id}`),
      t => `We expected the tester to be at use case '${uc?.id}', but it is at '${t?.url}' instead.`
    )
    .not(
      t => t.url.includes(id ? `/${id}` : ''),
      t => `We expected the path to contain '/42', but it is '${t?.url}' instead.`
    )
    .else(t => `The tester is at '${t?.url}'`);
};

expect.extend({
  toBeAt,
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R, T> {
      toBeAt(uc?: UseCase, id?: Id): R;
    }
  }
}
