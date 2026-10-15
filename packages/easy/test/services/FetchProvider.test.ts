import { FetchProvider, HttpVerb, RequestOptions } from '../../src';
import { DevUri } from '../ref';

describe('FetchProvider transport options', () => {
  test('follows only the configured number of redirects', async () => {
    const fetcher = jest
      .fn()
      .mockResolvedValueOnce(new Response(undefined, { status: 302, headers: { location: '/next' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } }));
    const provider = new FetchProvider(fetcher);

    const response = await provider.execute({
      uri: DevUri.Developers,
      verb: HttpVerb.Get,
      options: RequestOptions.Json.maxRedirects(1),
    });

    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(fetcher.mock.calls[1][0]).toBe(new URL('/next', DevUri.Developers.toString()).toString());
    expect(response.body.data?.items[0]).toMatchObject({ ok: true });
  });

  test('rejects when the redirect limit is exceeded', async () => {
    const fetcher = jest.fn().mockResolvedValue(new Response(undefined, { status: 302, headers: { location: '/next' } }));
    const provider = new FetchProvider(fetcher);

    await expect(
      provider.execute({
        uri: DevUri.Developers,
        verb: HttpVerb.Get,
        options: RequestOptions.Json.maxRedirects(0),
      })
    ).rejects.toMatchObject({ body: { error: { errors: [{ message: 'Maximum redirects exceeded' }] } } });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  test('drops authorization when a redirect changes origin', async () => {
    const fetcher = jest
      .fn()
      .mockResolvedValueOnce(new Response(undefined, { status: 302, headers: { location: 'https://external.example/next' } }))
      .mockResolvedValueOnce(new Response(undefined, { status: 200 }));
    const provider = new FetchProvider(fetcher);

    await provider.execute({
      uri: DevUri.Developers,
      verb: HttpVerb.Get,
      options: RequestOptions.Json.bearer('private token').maxRedirects(1),
    });

    expect(new Headers(fetcher.mock.calls[1][1].headers).has('Authorization')).toBe(false);
  });

  test('aborts after the configured timeout', async () => {
    jest.useFakeTimers();
    const fetcher = jest.fn(
      (_url, init: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init.signal?.addEventListener('abort', () => reject(new Error('aborted')));
        })
    );
    const provider = new FetchProvider(fetcher as typeof fetch);
    const request = provider.execute({ uri: DevUri.Developers, verb: HttpVerb.Get, options: RequestOptions.Json.timeout('10ms') });
    const result = request.then(
      response => response,
      error => error
    );

    await jest.advanceTimersByTimeAsync(10);
    expect(await result).toMatchObject({ body: { error: { errors: [{ message: 'aborted' }] } } });
    jest.useRealTimers();
  });
});
