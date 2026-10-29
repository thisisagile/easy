import * as App from '../../src/process/Apps';
import { Main, Enum, create } from '../../src/process/Apps';

describe('App', () => {
  const customerPortal = 'customer-portal';

  test('namespace and named imports have one identity', () => {
    expect(App.Main).toBe(Main);
    expect(Main).toBeInstanceOf(Enum);
    expect(App.all()).toEqual([Main]);
    expect(App.byId('main')).toBe(Main);
    expect(App.byId('missing')).toBeUndefined();
    expect(App.byIds(['main', 'missing', 'main'])).toEqual([Main]);
    expect(App.filter(value => value.equals('main'))).toEqual([Main]);
    expect(App.first()).toBe(Main);
  });

  test('factory constructs an app with enum identity', () => {
    const custom = create('Customer Portal');

    expect(custom).toMatchObject({
      name: 'Customer Portal',
      id: customerPortal,
      code: customerPortal,
    });
    expect(custom.equals(customerPortal)).toBe(true);
    expect(custom.toJSON()).toBe(customerPortal);
  });

  test('value class remains extendable', () => {
    class CustomApp extends Enum {}

    const custom = new CustomApp('Custom');
    expect(custom).toBeInstanceOf(Enum);
    expect(custom.name).toBe('Custom');
  });
});
