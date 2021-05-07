import { asString, uri, Uri } from '../../src';
import { DevUri } from '../ref';
import '@thisisagile/easy-test';
import { host } from '../../../../test/init';

describe('Uri', () => {
  const withHost = `${host}/dev/developers`;

  test('Host with context.', () => {
    expect(uri.host().segment).toBe(host);
  });

  test('Returns correct type', () => {
    expect(DevUri.Developers).toBeInstanceOf(DevUri);
  });

  test('returns full route', () => {
    expect(DevUri.Developers).toMatchRoute(withHost);
    expect(DevUri.Developer).toMatchRoute(`${host}/dev/developers/:id`);
  });

  test('path returns path', () => {
    expect(DevUri.Developers.path).toBe('/dev/developers');
  });

  test('route returns just route', () => {
    expect(DevUri.Developers.route()).toBe('/dev/developers');
    expect(DevUri.Developer.route()).toBe('/dev/developers/:id');
  });

  test('complete returns just route', () => {
    expect(DevUri.Developers.complete).toBe(withHost);
    expect(DevUri.Developer.complete).toBe(`${host}/dev/developers/:id`);
  });

  test('returns full route plus id', () => {
    expect(asString(0)).toBe('0');
    expect(DevUri.Developers.id(42)).toMatchRoute(withHost);
    expect(DevUri.Developer.id(42).id(43)).toMatchRoute(`${host}/dev/developers/43`);
    expect(DevUri.Developer.id(0)).toMatchRoute(`${host}/dev/developers/0`);
    expect(DevUri.Developers.level(3)).toMatchRoute(`${host}/dev/developers?level=3`);
    expect(DevUri.Developers.level(0)).toMatchRoute(`${host}/dev/developers?level=0`);
  });

  test('returns full route plus id and a query', () => {
    expect(DevUri.Developers.query('yes')).toMatchRoute(`${host}/dev/developers?q=yes`);
    expect(DevUri.Developer.id(42).query('yes')).toMatchRoute(`${host}/dev/developers/42?q=yes`);
  });

  test('returns full route plus id and two queries', () => {
    expect(DevUri.Developers.query('yes').language('Java')).toMatchRoute(`${host}/dev/developers?q=yes&language=Java`);
    expect(DevUri.Developer.id(42).query('yes').language('C')).toMatchRoute(`${host}/dev/developers/42?q=yes&language=C`);
  });

  test('toString returns full route with query', () => {
    expect(DevUri.Developers.query('yes').language('Java').toString()).toStrictEqual(`${host}/dev/developers?q=yes&language=Java`);
    expect(DevUri.Developer.id(42).query('yes').language('C').toString()).toStrictEqual(`${host}/dev/developers/42?q=yes&language=C`);
  });
});
