import App, { Main, Enum, create } from '../../src/entries/App';

describe('App', () => {
  const customerPortal = 'customer-portal';

  test('default namespace and named value have one identity', () => {
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
