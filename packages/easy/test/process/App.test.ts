import { App } from '../../src';

describe('App', () => {
  const app = new App('Test');

  test('name works', () => {
    expect(app.name).toBe('Test');
  });

  test('id works', () => {
    expect(app.id).toBe('test');
  });

  test('code works', () => {
    expect(app.code).toBe('test');
  });
});
