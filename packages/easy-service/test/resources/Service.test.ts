import { DevResource, DevService, DevsResource } from '../ref';
import { fits, mock } from '@thisisagile/easy-test';
import { AppProvider } from '../../src';

describe('Service', () => {
  let app: AppProvider;

  beforeEach(() => {
    app = { use: mock.return(), route: mock.return(), listen: mock.return() };
  });

  test('Construction works', () => {
    const service = new DevService('dev', app);
    expect(service.pre()).toHaveLength(0);
    expect(service.post()).toHaveLength(0);
  });

  test('start works', () => {
    const service = new DevService('Dev', app);
    service.with(DevsResource, DevResource).start();
    expect(app.route).toHaveBeenCalledTimes(2);
    expect(app.route).toHaveBeenCalledWith(service, fits.type(DevsResource));
    expect(app.route).toHaveBeenCalledWith(service, fits.type(DevResource));
    expect(app.listen).toHaveBeenCalledWith(8080, fits.any());
    expect(app.use).toHaveBeenCalledTimes(service.pre().length + service.post().length);
  });

  test('atPort works', () => {
    const service = new DevService('Dev', app);
    service.with(DevsResource, DevResource).atPort(9001).start();
    expect(app.listen).toHaveBeenCalledWith(9001, fits.any());
  });
});
