import CustomMatcherResult = jest.CustomMatcherResult;
import { toString, Uri } from '../utils/Types';
import { match } from './Match';

export const toMatchRoute = (uri?: Uri, route?: Uri | string): CustomMatcherResult =>
  match<Uri | undefined>(uri)
    .undefined(u => u, 'Subject is undefined.')
    .undefined(() => route, 'Route to include is undefined.')
    .not(
      u => toString(u).includes(toString(route)),
      u => `Uri '${u}' does not include '${route}'.`
    )
    .else(u => `Uri '${u}' includes '${route}'`);

expect.extend({
  toMatchRoute: toMatchRoute,
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R, T> {
      toMatchRoute(route?: Uri | string): R;
    }
  }
}
