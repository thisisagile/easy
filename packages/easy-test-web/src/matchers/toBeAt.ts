import CustomMatcherResult = jest.CustomMatcherResult;
import { Match } from '@thisisagile/easy-test';
import { Id, UseCase } from '@thisisagile/easy';
import { toUrl, Tester } from '../Tester';

const ucUrl = (t: Tester, uc?: UseCase, id? : Id): string => toUrl(uc as UseCase, t.domain, t.port, id)

export const toBeAt = (tester?: Tester, uc?: UseCase, id?: Id): CustomMatcherResult =>{
  return new Match<Tester>(tester as Tester)
    .undefined(t => t, 'Tester is undefined')
    .undefined(() => uc, 'uc is undefined')
    .not(
      t => t.url === ucUrl(t, uc, id),
      t => `We expected to be at: '${ucUrl(t, uc, id)}', but are at: '${t.url}' instead.`,
    )
    .else(`Tester is at '${tester?.url}'`);
}


expect.extend({
  toBeAt,
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R, T> {
      toBeAt(url?: string): R;
    }
  }
}
