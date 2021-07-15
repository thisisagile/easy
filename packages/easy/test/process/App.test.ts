import { App } from '../../src/process/App';

describe('App', () => {
  const app = new App('Test', 5000);

  test('port works', () => {
    expect(app.port).toBe(5000);
  });

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
