import { Service } from '../../src/services/Service';
import { DevResource, DevsResource } from '../ref';
import { AppProvider } from '../../src';
import { fits, mock } from '@thisisagile/easy-test';

describe('Service', () => {
  const app: AppProvider = { use: mock.return(), route: mock.return(), listen: mock.return() };

  test('Set up service works', () => {
    new Service('Dev', app).with(DevsResource, DevResource).listensAt(8080);
    expect(app.route).toHaveBeenCalledTimes(2);
    expect(app.route).toHaveBeenCalledWith(DevsResource);
    expect(app.route).toHaveBeenCalledWith(DevResource);
    expect(app.listen).toHaveBeenCalledWith(8080, fits.any());
  });
});
