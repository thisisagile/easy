import { get, route } from '../../src/services';
import { meta } from '../../src/utils';
import { DevUri } from '../ref/DevUri';
import { Uri } from '../../src/types';

describe('Route', () => {

  @route(DevUri.Developers)
  class Resource {
    @get() all = () => '';
  }

  test('Route works on a class', () => {
    const route: Uri = meta(new Resource()).get('route');
    expect(route).toBeInstanceOf(DevUri);
    expect(route.route.toString()).toBe('/developers');
  });
});
