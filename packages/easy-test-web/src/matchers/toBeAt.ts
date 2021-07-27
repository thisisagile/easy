import CustomMatcherResult = jest.CustomMatcherResult;
import { Tester } from '../Tester';
import { Match } from '@thisisagile/easy-test';

export const toBeAt = (tester?: Tester, url?: string): CustomMatcherResult =>
  new Match<Tester>(tester as Tester)
    .undefined(t => t, 'Tester is undefined')
    .not(
      t => t.url === url,
      t => `We expected to be at: '${url}', but are at: '${t.url}' instead.`
    )
    .else(`Tester is at '${url}'`);

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
