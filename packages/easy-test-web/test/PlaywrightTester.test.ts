import { App, EnvContext, UseCase } from '@thisisagile/easy';
import { mock } from '@thisisagile/easy-test';
import { Browser, ElementHandle, Page, Response } from 'playwright';
import { HTTPResponse } from 'puppeteer';
import { PlaywrightElement, PlaywrightTester } from '../src';

describe('PlaywrightTester', () => {
  let tester: PlaywrightTester;
  let env: EnvContext;
  let browser: Browser;
  let page: Page;
  let app: App;
  let uc: UseCase;
  const testUrl = 'http://localhost/shops';

  beforeEach(() => {
    env = mock.empty<EnvContext>({ host: 'http://localhost', port: 8080 });
    browser = mock.empty<Browser>();
    page = mock.empty<Page>();
    tester = new PlaywrightTester(env, browser, page);
    app = mock.empty<App>({ name: 'shops' });
    uc = mock.empty<UseCase>({ app: app, name: 'find shop' });
  });

  test.each([
    ['byClass element not found', { handle: mock.empty<Promise<null>>() }],
    ['byClass element found', { handle: mock.empty<Promise<ElementHandle>>() }],
  ])('%s', (name, { handle }) => {
    const pe = new PlaywrightElement(handle);
    page.waitForSelector = mock.return(pe);

    const result = tester.byClass('className');

    expect(result).toBeInstanceOf(PlaywrightElement);
    expect(result).toMatchObject(pe);
    expect(page.waitForSelector).toHaveBeenCalledWith('.className');
    expect(page.waitForSelector).toHaveBeenCalledTimes(1);
  });

  test.each([
    ['byId element not found', { handle: mock.empty<Promise<null>>() }],
    ['byId element found', { handle: mock.empty<Promise<ElementHandle>>() }],
    // eslint-disable-next-line jest/no-identical-title
  ])('%s', (name, { handle }) => {
    const pe = new PlaywrightElement(handle);
    page.waitForSelector = mock.return(pe);

    const result = tester.byId('searchedId');

    expect(result).toBeInstanceOf(PlaywrightElement);
    expect(result).toMatchObject(pe);
    expect(page.waitForSelector).toHaveBeenCalledWith('#searchedId');
    expect(page.waitForSelector).toHaveBeenCalledTimes(1);
  });

  test.each([
    ['byDateTestId element not found', { handle: mock.empty<Promise<null>>() }],
    ['byDateTestId element found', { handle: mock.empty<Promise<ElementHandle>>() }],
    // eslint-disable-next-line jest/no-identical-title
  ])('%s', (name, { handle }) => {
    const pe = new PlaywrightElement(handle);
    page.waitForSelector = mock.return(pe);

    const result = tester.byDateTestId('dateTestIdValue');

    expect(result).toBeInstanceOf(PlaywrightElement);
    expect(result).toMatchObject(pe);
    expect(page.waitForSelector).toHaveBeenCalledWith('[data-testid=dateTestIdValue]');
    expect(page.waitForSelector).toHaveBeenCalledTimes(1);
  });

  test.each([
    ['byName element not found', { handle: mock.empty<Promise<null>>() }],
    ['byName element found', { handle: mock.empty<Promise<ElementHandle>>() }],
    // eslint-disable-next-line jest/no-identical-title
  ])('%s', (name, { handle }) => {
    const pe = new PlaywrightElement(handle);
    page.waitForSelector = mock.return(pe);

    const result = tester.byName('nameValue');

    expect(result).toBeInstanceOf(PlaywrightElement);
    expect(result).toMatchObject(pe);
    expect(page.waitForSelector).toHaveBeenCalledWith('[name=nameValue]');
    expect(page.waitForSelector).toHaveBeenCalledTimes(1);
  });

  test.each([
    ['by element not found', { handle: mock.empty<Promise<null>>() }],
    ['by element found', { handle: mock.empty<Promise<ElementHandle>>() }],
    // eslint-disable-next-line jest/no-identical-title
  ])('%s', (name, { handle }) => {
    const pe = new PlaywrightElement(handle);
    page.waitForSelector = mock.return(pe);

    const result = tester.by('K', 'V');

    expect(result).toBeInstanceOf(PlaywrightElement);
    expect(result).toMatchObject(pe);
    expect(page.waitForSelector).toHaveBeenCalledWith('[K=V]');
    expect(page.waitForSelector).toHaveBeenCalledTimes(1);
  });

  test('submit', () => {
    const h = mock.empty<Promise<ElementHandle>>();
    const pe = new PlaywrightElement(h);

    page.waitForSelector = mock.return(pe);

    const result = tester.submit();

    expect(result).toBeInstanceOf(PlaywrightElement);
    expect(result).toMatchObject(pe);
    expect(page.waitForSelector).toHaveBeenCalledWith('[type=submit]');
    expect(page.waitForSelector).toHaveBeenCalledTimes(1);
  });

  test('row', () => {
    const h = mock.empty<Promise<ElementHandle>>();
    const pe = new PlaywrightElement(h);

    page.waitForSelector = mock.return(pe);

    const result = tester.row('value');

    expect(result).toBeInstanceOf(PlaywrightElement);
    expect(result).toMatchObject(pe);
    expect(page.waitForSelector).toHaveBeenCalledWith(`(//tr[contains(., 'value')])[1]`);
    expect(page.waitForSelector).toHaveBeenCalledTimes(1);
  });

  test('search', async () => {
    const eh = mock.empty<ElementHandle>();
    eh.type = mock.resolve();
    eh.click = mock.resolve();
    page.waitForSelector = mock.resolve(eh);

    await expect(tester.search('searchText')).resolves.toBeUndefined();

    expect(page.waitForSelector).toHaveBeenCalledTimes(2);
    expect(page.waitForSelector).toHaveBeenCalledWith(`#search`);
    expect(page.waitForSelector).toHaveBeenCalledWith(`.ant-input-search-button`);
    expect(eh.type).toHaveBeenCalledWith('searchText');
    expect(eh.click).toHaveBeenCalledTimes(1);
  });

  test('redirect resolves ok response', async () => {
    const r = mock.empty<HTTPResponse>();
    r.ok = mock.return(true);

    page.goto = mock.resolve(r);

    await expect(tester.redirect(testUrl)).resolves.toBeTruthy();
    expect(page.goto).toHaveBeenCalledWith(testUrl);
  });

  test('redirect resolves not ok response', async () => {
    const r = mock.empty<HTTPResponse>();
    r.ok = mock.return(false);

    page.goto = mock.resolve(r);

    await expect(tester.redirect(testUrl)).resolves.toBeFalsy();
  });

  test('redirect resolves empty response', async () => {
    page.goto = mock.resolve();

    await expect(tester.redirect(testUrl)).resolves.toBeFalsy();
  });

  test('goto resolves ok response', async () => {
    const r = mock.empty<Response>();
    r.ok = mock.return(true);

    page.goto = mock.resolve(r);

    await expect(tester.goto(uc)).resolves.toBeTruthy();
    expect(page.goto).toHaveBeenCalledWith('http://localhost:8080/shops/find-shop');
  });

  test('goto with id resolves ok response', async () => {
    const r = mock.empty<Response>();
    r.ok = mock.return(true);

    page.goto = mock.resolve(r);

    await expect(tester.goto(uc, 1)).resolves.toBeTruthy();
    expect(page.goto).toHaveBeenCalledWith('http://localhost:8080/shops/find-shop/1');
  });

  test('goto resolves not ok response', async () => {
    const r = mock.empty<Response>();
    r.ok = mock.return(false);

    page.goto = mock.resolve(r);

    await expect(tester.goto(uc)).resolves.toBeFalsy();
  });

  test('goto resolves empty response', async () => {
    page.goto = mock.resolve();

    await expect(tester.goto(uc)).resolves.toBeFalsy();
  });

  test('wait resolves ok response', async () => {
    const r = mock.empty<Response>();
    r.ok = mock.return(true);

    page.waitForNavigation = mock.resolve(r);

    await expect(tester.wait()).resolves.toBeTruthy();
  });

  test('wait resolves not ok response', async () => {
    const r = mock.empty<Response>();
    r.ok = mock.return(false);

    page.waitForNavigation = mock.resolve(r);

    await expect(tester.wait()).resolves.toBeFalsy();
  });

  test('wait resolves empty response', async () => {
    page.waitForNavigation = mock.resolve();

    await expect(tester.wait()).resolves.toBeFalsy();
  });

  test('close resolves', async () => {
    browser.close = mock.resolve();

    await expect(tester.close()).resolves.toBeUndefined();
  });

  test('url', () => {
    page.url = mock.return('http://thisurl.com');

    expect(tester.url).toMatch('http://thisurl.com');
  });

  test('Login with username and password', async () => {
    const eh = mock.empty<ElementHandle>();
    eh.type = mock.resolve();
    eh.click = mock.resolve();
    page.waitForSelector = mock.resolve(eh);

    const r = mock.empty<Response>();
    r.ok = mock.return(true);

    page.waitForNavigation = mock.resolve(r);

    await expect(tester.login('henk', 'henk123')).resolves.toBeTruthy();

    expect(page.waitForSelector).toHaveBeenCalledTimes(3);
    expect(page.waitForSelector).toHaveBeenCalledWith(`#form_email`);
    expect(page.waitForSelector).toHaveBeenCalledWith(`#form_password`);
    expect(page.waitForSelector).toHaveBeenCalledWith(`[type=submit]`);
    expect(eh.type).toHaveBeenCalledWith('henk');
    expect(eh.type).toHaveBeenCalledWith('henk123');
    expect(eh.click).toHaveBeenCalledTimes(1);
  });

  test('Login username and password from env', async () => {
    env.get = mock.impl((key: string) => {
      if (key === 'User') return 'Henkie';
      if (key === 'Password') return 'Welcome123!';
      throw new Error('unknown key fetched');
    });
    const eh = mock.empty<ElementHandle>();
    eh.type = mock.resolve();
    eh.click = mock.resolve();
    page.waitForSelector = mock.resolve(eh);

    const r = mock.empty<Response>();
    r.ok = mock.return(true);

    page.waitForNavigation = mock.resolve(r);

    await expect(tester.login()).resolves.toBeTruthy();

    expect(eh.type).toHaveBeenCalledWith('Henkie');
    expect(eh.type).toHaveBeenCalledWith('Welcome123!');
  });
});
