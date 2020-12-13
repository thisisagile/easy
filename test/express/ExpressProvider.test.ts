import express, { Express, RequestHandler } from 'express';
import { fits, mock } from '@thisisagile/easy-test';
import { ExpressProvider } from '../../src';
import { DevsResource } from '../ref';

describe('ExpressProvider', () => {

  const app = { listen: mock.return(), use: mock.return() } as unknown as Express;
  const handler = {} as unknown as RequestHandler;
  let provider: ExpressProvider;

  beforeEach(() => {
    provider = new ExpressProvider(app);
  });

  test('use', () => {
    provider.use(handler);
    expect(app.use).toHaveBeenCalledWith(handler);
  });

  test('listen', () => {
    provider.listen(9001);
    expect(app.listen).toHaveBeenCalledWith(9001, fits.type(Function));
  });

  test('route', () => {
    const router = express.Router();
    express.Router = mock.return(router);
    provider.route(DevsResource);
    expect(app.use).toHaveBeenCalledWith(router);
    expect(router['get']).toEqual(fits.type(Function));
    expect(router['post']).toEqual(fits.type(Function));
  });
});
