import { create } from '@thisisagile/easy/UseCase';
import { BrowserTester, ClosableBrowserTester, Navigation, redirect, toUrl, waitForNavigation } from '../src';

import * as App from '@thisisagile/easy/App';

describe('Tester', () => {
  const host = 'http://localhost:9999';
  const uc = create(App.Main, 'Review Code', 'Review');

  test('toUrl works', () => {
    expect(toUrl(uc)).toMatch('/main/review');
  });

  test('toUrl with host works', () => {
    expect(toUrl(uc, host)).toMatch('http://localhost:9999/main/review');
  });

  test('toUrl with id works', () => {
    expect(toUrl(uc, '', 42)).toMatch('/main/review/42');
  });

  test('redirect reports whether navigation succeeded', async () => {
    const navigation = {
      goto: jest.fn().mockResolvedValue({ ok: () => true }),
      waitForNavigation: jest.fn(),
    };

    await expect(redirect(navigation, host)).resolves.toBe(true);
    expect(navigation.goto).toHaveBeenCalledWith(host);
  });

  test('redirect reports a missing navigation response as unsuccessful', async () => {
    const navigation = {
      goto: jest.fn().mockResolvedValue(null),
      waitForNavigation: jest.fn(),
    };

    await expect(redirect(navigation, host)).resolves.toBe(false);
  });

  test('waitForNavigation handles empty responses', async () => {
    const navigation = {
      goto: jest.fn(),
      waitForNavigation: jest.fn().mockResolvedValue(null),
    };

    await expect(waitForNavigation(navigation)).resolves.toBe(false);
  });

  test('browser testers share navigation behavior', async () => {
    const navigation: Navigation = {
      goto: jest.fn().mockResolvedValue({ ok: () => true }),
      waitForNavigation: jest.fn().mockResolvedValue({ ok: () => true }),
    };
    class TestBrowserTester extends BrowserTester<Navigation> {
      constructor() {
        super(host, navigation);
      }
    }
    const tester = new TestBrowserTester();

    await expect(tester.redirect(host)).resolves.toBe(true);
    await expect(tester.goto(uc, 42)).resolves.toBe(true);
    await expect(tester.wait()).resolves.toBe(true);
    expect(navigation.goto).toHaveBeenNthCalledWith(2, `${host}/main/review/42`);
  });

  test('closable browser testers close their browser', async () => {
    const browser = { close: jest.fn().mockResolvedValue(undefined) };
    const navigation: Navigation = {
      goto: jest.fn(),
      waitForNavigation: jest.fn(),
    };
    class TestClosableBrowserTester extends ClosableBrowserTester<Navigation> {}

    const tester = new TestClosableBrowserTester(host, browser, navigation);
    await tester.close();

    expect(browser.close).toHaveBeenCalledTimes(1);
  });
});
