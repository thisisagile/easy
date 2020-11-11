import { Uri } from '../../src/types';
import { DevUri } from '../ref/DevUri';

describe('Uri', () => {

  test('Returns correct type', () => {
    expect(DevUri.Developers).toBeInstanceOf(DevUri);
  });

  test('toString returns full route', () => {
    expect(DevUri.Developers.toString()).toBe('$host/$resource/developers');
    expect(DevUri.Developer.toString()).toBe('$host/$resource/developers/:id');
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
    expect(DevUri.Developers.id(42).toString()).toBe('$host/$resource/developers');
    expect(DevUri.Developer.id(42).toString()).toBe('$host/$resource/developers/42');
  });

  test('toString returns full route plus id and a query', () => {
    expect(DevUri.Developers.query('yes').toString()).toBe('$host/$resource/developers?q=yes');
    expect(DevUri.Developer.id(42).query('yes').toString()).toBe('$host/$resource/developers/42?q=yes');
  });

  test('toString returns full route plus id and two queries', () => {
    expect(DevUri.Developers.query('yes').language('Java').toString()).toBe('$host/$resource/developers?q=yes&language=Java');
    expect(DevUri.Developer.id(42).query('yes').language('C').toString()).toBe('$host/$resource/developers/42?q=yes&language=C');
  });
});
