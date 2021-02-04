import { HttpVerb, meta, route, routes, Uri } from '../../src';
import { DevsResource, DevUri } from '../ref';
import '@thisisagile/easy-test';

describe('Route', () => {
  test('Route works on a class', () => {
    const route: Uri = meta(new DevsResource()).get('route');
    expect(route).toBeInstanceOf(DevUri);
    expect(route.route).toMatchText('/developers');
  });
});

describe('Router', () => {
  test('Router works on a valid class', () => {
    const { route, endpoints } = routes(new DevsResource());
    expect(route).toBeInstanceOf(DevUri);
    expect(route.route).toMatchText('/developers');
    expect(endpoints).toHaveLength(2);
    expect(endpoints[0].verb.verb).toBe(HttpVerb.Get);
  });
});
