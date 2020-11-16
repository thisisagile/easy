import { HttpVerb, route, router } from '../../src/services';
import { DevUri } from '../ref/DevUri';
import { meta, Uri } from '../../src/types';
import { DevsResource } from '../ref/DevResource';

describe('Route', () => {

  test('Route works on a class', () => {
    const route: Uri = meta(new DevsResource()).get('route');
    expect(route).toBeInstanceOf(DevUri);
    expect(route.route.toString()).toBe('/developers');
  });
});

describe('Router', () => {

  test('Router works on a non-valid object', () => {
    const { route, verbs } = router({});
    expect(route).toBeUndefined();
    expect(verbs).toHaveLength(0);
  });

  test('Router works on a valid class', () => {
    const { route, verbs } = router(new DevsResource());
    expect(route).toBeInstanceOf(DevUri);
    expect(route.route.toString()).toBe('/developers');
    expect(verbs).toHaveLength(2);
    expect(verbs[0].verb).toBe(HttpVerb.Get);
  });
});
