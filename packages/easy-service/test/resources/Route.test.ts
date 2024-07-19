import { HttpVerb, meta, Uri } from '@thisisagile/easy';
import { DevResource, DevsResource, DevUri } from '../ref';
import '@thisisagile/easy-test';
import { DevScope, DevUseCase } from '@thisisagile/easy/test/ref/DevUseCase';
import { routes } from '../../src';

describe('Route', () => {
  test('Route works on a class', () => {
    const route: Uri = meta(new DevsResource()).get('route');
    expect(route).toBeInstanceOf(DevUri);
    expect(route.route('dev')).toMatchText('/dev/developers');
  });
});

describe('Router', () => {
  test('Router works on a valid class', () => {
    const { route, endpoints } = routes(new DevsResource());
    expect(route).toBeInstanceOf(DevUri);
    expect(route.route('dev')).toMatchText('/dev/developers');
    expect(endpoints).toHaveLength(2);
    expect(endpoints[0].verb.verb).toBe(HttpVerb.Get);
  });

  test('Router works on a secured class', () => {
    const { endpoints } = routes(new DevResource());
    expect(endpoints[0].requires.scope).toBe(DevScope.Dev);
    expect(endpoints[1].requires.uc).toBe(DevUseCase.WriteCode);
    expect(endpoints[2].requires.token).toBeTruthy();
  });
});
