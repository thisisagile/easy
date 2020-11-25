import { AxiosProvider } from '../../src/services/AxiosProvider';
import { DevUri } from '../ref/DevUri';
import { HttpVerb } from '../../src/services';
import axios from 'axios';
import { fits, mock } from '@thisisagile/easy-test';

describe('AxiosProvider', () => {

  let provider: AxiosProvider;

  beforeEach(() => {
    provider = new AxiosProvider();
  });

  test('Simple get', async () => {
    axios.request = mock.resolve({ name: 'Sander' });
    const r = await provider.execute({ uri: DevUri.Developers, verb: HttpVerb.Get });
    expect(axios.request).toBeCalledWith(fits.with({ url: DevUri.Developers.toString(), method: 'GET' }));
    expect(r.data.items).toHaveLength(1);
  });

  test('Get with list', async () => {
    axios.request = mock.resolve([{ name: 'Sander' }, { name: 'Wouter' }]);
    const r = await provider.execute({ uri: DevUri.Developers, verb: HttpVerb.Get });
    expect(r.data.items).toHaveLength(2);
  });

  test('Get with reject and response', async () => {
    axios.request = mock.reject({ response: { statusText: 'This is wrong' } });
    const r = await provider.execute({ uri: DevUri.Developers, verb: HttpVerb.Get });
    expect(r.error.errors[0]).toMatchObject(fits.with({ message: 'This is wrong' }));
  });

  test('Get with reject and request', async () => {
    axios.request = mock.reject({ request: { statusText: 'This is wrong' } });
    const r = await provider.execute({ uri: DevUri.Developers, verb: HttpVerb.Get });
    expect(r.error.errors[0]).toMatchObject(fits.with({ message: 'This is wrong' }));
  });

  test('Get with reject and message', async () => {
    axios.request = mock.reject({ message: 'This is wrong' });
    const r = await provider.execute({ uri: DevUri.Developers, verb: HttpVerb.Get });
    expect(r.error.errors[0]).toMatchObject(fits.with({ message: 'This is wrong' }));
  });
});
