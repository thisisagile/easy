import { AppProvider, error, Handler, notFound, Service } from '../../src';
import { DevResource, DevsResource } from '../ref';
import { fits, mock } from '@thisisagile/easy-test';

class DevService extends Service {
  pre = (): Handler[] => [];
  post = (): Handler[] => [notFound, error];
}

describe('Service', () => {
  let app: AppProvider;

  beforeEach(() => {
    app = { use: mock.return(), route: mock.return(), listen: mock.return() };
  });

  test('Construction works', () => {
    const service = new DevService('dev');
    expect(service.pre()).toHaveLength(0);
    expect(service.post()).toHaveLength(2);
  });

  test('Listen works', () => {
    const service = new DevService('Dev', app);
    service.with(DevsResource, DevResource).listensAt(8080);
    expect(app.route).toHaveBeenCalledTimes(2);
    expect(app.route).toHaveBeenCalledWith(fits.type(DevsResource));
    expect(app.route).toHaveBeenCalledWith(fits.type(DevResource));
    expect(app.listen).toHaveBeenCalledWith(8080, fits.any());
    expect(app.use).toHaveBeenCalledTimes(service.pre().length + service.post().length);
  });
});
