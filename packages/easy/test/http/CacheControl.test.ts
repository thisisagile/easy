import { CacheControl } from '../../src';
import '@thisisagile/easy-test';
import { mock } from '@thisisagile/easy-test';

class request {
  setHeader = (name: string, value: number | string | ReadonlyArray<string>) => ({ name, value });
}

describe('CacheControl', () => {
  test('CacheControl custom', () => {
    expect(CacheControl.custom(-3).value()).toBe('max-age=3');
    expect(CacheControl.custom(5).value()).toBe('max-age=5');
    expect(CacheControl.custom(5).value()).toBe('max-age=5');
    expect(CacheControl.custom(-1, -3).value()).toBe('max-age=1, stale-while-revalidate=3');
    expect(CacheControl.custom(2, 3).value()).toBe('max-age=2, stale-while-revalidate=3');
    expect(CacheControl.custom(2, 3).maxAge(1).staleWhileRevalidate().value()).toBe('max-age=1');
  });


  test('CacheControl non custom', () => {
    expect(CacheControl.OneSecond().value()).toBe('max-age=1, stale-while-revalidate=1');
    expect(CacheControl.fiveSeconds().value()).toBe('max-age=5, stale-while-revalidate=5');
    expect(CacheControl.tenSeconds().value()).toBe('max-age=10, stale-while-revalidate=10');
    expect(CacheControl.disabled().value()).toBe('');
  });

  test('enabled', () => {
    expect(CacheControl.OneSecond().enabled).toBeTruthy();
    expect(CacheControl.fiveSeconds().enabled).toBeTruthy();
    expect(CacheControl.tenSeconds().enabled).toBeTruthy();
    expect(CacheControl.custom(2, 3).enabled).toBeTruthy();
    expect(CacheControl.disabled().enabled).toBeFalsy();
  });

  test('disabled should not call setHeader', () => {
    const req = mock.empty<request>();
    req.setHeader = mock.return({});
    const r = CacheControl.disabled().setHeader(req.setHeader);
    expect(req.setHeader).not.toHaveBeenCalled();
    expect(r).toEqual({ })
  });


  test('setHeader should be called correctly', () => {
    const req = mock.empty<request>();
    const headerResult = {a:'123'}
    req.setHeader = mock.return(headerResult);
    const cc = CacheControl.custom(1, 2);

    const r = cc.setHeader(req.setHeader);

    expect(req.setHeader).toHaveBeenCalledWith('Cache-Control', cc.value());
    expect(r).toBe(headerResult)
  });
});
