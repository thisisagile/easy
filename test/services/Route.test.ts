import { HttpVerb, meta, route, routes, Uri } from '../../src';
import { DevsResource, DevUri } from '../ref';

describe('Route', () => {
  test('Route works on a class', () => {
    const route: Uri = meta(new DevsResource()).get('route');
    expect(route).toBeInstanceOf(DevUri);
    expect(route.route.toString()).toBe('/developers');
  });
});

describe('Router', () => {
  test('Router works on a valid class', () => {
    const { route, endpoints } = routes(DevsResource);
    expect(route).toBeInstanceOf(DevUri);
    expect(route.route.toString()).toBe('/developers');
    expect(endpoints).toHaveLength(2);
    expect(endpoints[0].verb).toBe(HttpVerb.Get);
  });
});
