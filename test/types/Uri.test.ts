import { Uri } from '../../src/types';
import { DevUri } from '../ref/DevUri';
import '@thisisagile/easy-test';

describe('Uri', () => {

  test('Returns correct type', () => {
    expect(DevUri.Developers).toBeInstanceOf(DevUri);
  });

  test('toString returns full route', () => {
    expect(DevUri.Developers).toMatchRoute('$host/$resource/developers');
    expect(DevUri.Developer).toMatchRoute('$host/$resource/developers/:id');
  });

  test('route returns just route', () => {
    expect(DevUri.Developers.route).toBe('/developers');
    expect(DevUri.Developer.route).toBe('/developers/:id');
  });

  test('complete returns just route', () => {
    expect(DevUri.Developers.complete).toBe('$host/$resource/developers');
    expect(DevUri.Developer.complete).toBe('$host/$resource/developers/:id');
  });

  test('toString returns full route plus id', () => {
    expect(DevUri.Developers.id(42)).toMatchRoute('$host/$resource/developers');
    expect(DevUri.Developer.id(42)).toMatchRoute('$host/$resource/developers/42');
  });

  test('toString returns full route plus id and a query', () => {
    expect(DevUri.Developers.query('yes')).toMatchRoute('$host/$resource/developers?q=yes');
    expect(DevUri.Developer.id(42).query('yes')).toMatchRoute('$host/$resource/developers/42?q=yes');
  });

  test('toString returns full route plus id and two queries', () => {
    expect(DevUri.Developers.query('yes').language('Java')).toMatchRoute('$host/$resource/developers?q=yes&language=Java');
    expect(DevUri.Developer.id(42).query('yes').language('C')).toMatchRoute('$host/$resource/developers/42?q=yes&language=C');
  });
});
