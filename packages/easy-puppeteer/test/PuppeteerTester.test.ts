import { mock } from '@thisisagile/easy-test';
import { Browser, ElementHandle, HTTPResponse, Page } from 'puppeteer';
import { PuppeteerElement, PuppeteerTester } from '../src';
import { DevUseCase } from '@thisisagile/easy/test/ref/DevUseCase';

describe('PuppeteerTester', () => {
  let tester: PuppeteerTester;
  let browser: Browser;
  let page: Page;
  const uc = DevUseCase.ReleaseCode;
  const host = 'http://localhost:8080';
  const testUrl = 'http://localhost/shops';

  beforeEach(() => {
    browser = mock.empty<Browser>();
    page = mock.empty<Page>();
    tester = new PuppeteerTester(host, browser, page);
  });

  test.each([
    ['byClass element not found', { handle: mock.empty<Promise<null>>() }],
    ['byClass element found', { handle: mock.empty<Promise<ElementHandle>>() }],
  ])('%s', (name, { handle }) => {
    const pe = new PuppeteerElement(handle);
    page.waitForSelector = mock.return(pe);

    const result = tester.byClass('className');

    expect(result).toBeInstanceOf(PuppeteerElement);
    expect(result).toMatchObject(pe);
    expect(page.waitForSelector).toHaveBeenCalledWith('.className');
    expect(page.waitForSelector).toHaveBeenCalledTimes(1);
  });

  test.each([
    ['byId element not found', { handle: mock.empty<Promise<null>>() }],
    ['byId element found', { handle: mock.empty<Promise<ElementHandle>>() }],
    // eslint-disable-next-line jest/no-identical-title
  ])('%s', (name, { handle }) => {
    const pe = new PuppeteerElement(handle);
    page.waitForSelector = mock.return(pe);

    const result = tester.byId('searchedId');

    expect(result).toBeInstanceOf(PuppeteerElement);
    expect(result).toMatchObject(pe);
    expect(page.waitForSelector).toHaveBeenCalledWith('#searchedId');
    expect(page.waitForSelector).toHaveBeenCalledTimes(1);
  });

  test.each([
    ['byDateTestId element not found', { handle: mock.empty<Promise<null>>() }],
    ['byDateTestId element found', { handle: mock.empty<Promise<ElementHandle>>() }],
    // eslint-disable-next-line jest/no-identical-title
  ])('%s', (name, { handle }) => {
    const pe = new PuppeteerElement(handle);
    page.waitForSelector = mock.return(pe);

    const result = tester.byDataTestId('dateTestIdValue');

    expect(result).toBeInstanceOf(PuppeteerElement);
    expect(result).toMatchObject(pe);
    expect(page.waitForSelector).toHaveBeenCalledWith('[data-testid=dateTestIdValue]');
    expect(page.waitForSelector).toHaveBeenCalledTimes(1);
  });

  test.each([
    ['byName element not found', { handle: mock.empty<Promise<null>>() }],
    ['byName element found', { handle: mock.empty<Promise<ElementHandle>>() }],
    // eslint-disable-next-line jest/no-identical-title
  ])('%s', (name, { handle }) => {
    const pe = new PuppeteerElement(handle);
    page.waitForSelector = mock.return(pe);

    const result = tester.byName('nameValue');

    expect(result).toBeInstanceOf(PuppeteerElement);
    expect(result).toMatchObject(pe);
    expect(page.waitForSelector).toHaveBeenCalledWith('[name=nameValue]');
    expect(page.waitForSelector).toHaveBeenCalledTimes(1);
  });

  test.each([
    ['by element not found', { handle: mock.empty<Promise<null>>() }],
    ['by element found', { handle: mock.empty<Promise<ElementHandle>>() }],
    // eslint-disable-next-line jest/no-identical-title
  ])('%s', (name, { handle }) => {
    const pe = new PuppeteerElement(handle);
    page.waitForSelector = mock.return(pe);

    const result = tester.by('K', 'V');

    expect(result).toBeInstanceOf(PuppeteerElement);
    expect(result).toMatchObject(pe);
    expect(page.waitForSelector).toHaveBeenCalledWith('[K=V]');
    expect(page.waitForSelector).toHaveBeenCalledTimes(1);
  });

  test('submit', () => {
    const h = mock.empty<Promise<ElementHandle>>();
    const pe = new PuppeteerElement(h);

    page.waitForSelector = mock.return(pe);

    const result = tester.submit();

    expect(result).toBeInstanceOf(PuppeteerElement);
    expect(result).toMatchObject(pe);
    expect(page.waitForSelector).toHaveBeenCalledWith('[type=submit]');
    expect(page.waitForSelector).toHaveBeenCalledTimes(1);
  });

  test('row', () => {
    const h = mock.empty<Promise<ElementHandle>>();
    const pe = new PuppeteerElement(h);

    page.waitForSelector = mock.return(pe);

    const result = tester.row('value');

    expect(result).toBeInstanceOf(PuppeteerElement);
    expect(result).toMatchObject(pe);
    expect(page.waitForSelector).toHaveBeenCalledWith(`xpath/.(//tr[contains(., 'value')])[1]`);
    expect(page.waitForSelector).toHaveBeenCalledTimes(1);
  });

  test('goto resolves ok response', async () => {
    const r = mock.empty<HTTPResponse>();
    r.ok = mock.return(true);

    page.goto = mock.resolve(r);

    await expect(tester.goto(uc)).resolves.toBeTruthy();
    expect(page.goto).toHaveBeenCalledWith('http://localhost:8080/main/release-code');
  });

  test('goto with id resolves ok response', async () => {
    const r = mock.empty<HTTPResponse>();
    r.ok = mock.return(true);

    page.goto = mock.resolve(r);

    await expect(tester.goto(uc, 1)).resolves.toBeTruthy();
    expect(page.goto).toHaveBeenCalledWith('http://localhost:8080/main/release-code/1');
  });

  test('goto resolves not ok response', async () => {
    const r = mock.empty<HTTPResponse>();
    r.ok = mock.return(false);

    page.goto = mock.resolve(r);

    await expect(tester.goto(uc)).resolves.toBeFalsy();
  });

  test('goto resolves empty response', async () => {
    page.goto = mock.resolve();

    await expect(tester.goto(uc)).resolves.toBeFalsy();
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

  test('wait resolves ok response', async () => {
    const r = mock.empty<HTTPResponse>();
    r.ok = mock.return(true);

    page.waitForNavigation = mock.resolve(r);

    await expect(tester.wait()).resolves.toBeTruthy();
  });

  test('wait resolves not ok response', async () => {
    const r = mock.empty<HTTPResponse>();
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

  test('env', () => {
    expect(tester.host).toBe(host);
  });

  test('undefined webHost env var will set host to empty string', async () => {
    const t = await PuppeteerTester.init();
    expect(t.host).toBe('');
    return t.close();
  }, 10000);

  test('webHost uses env var by default', async () => {
    process.env.WEB_HOST = host;
    const t = await PuppeteerTester.init();
    expect(t.host).toBe(host);
    return t.close();
  }, 10000);

  test('webHost uses provided value', async () => {
    const h = 'http://goof.fy';
    const t = await PuppeteerTester.init(h);
    expect(t.host).toBe(h);
    return t.close();
  }, 10000);
});

describe('PuppeteerElement', () => {
  test('click', async () => {
    const eh = mock.empty<ElementHandle>();
    eh.click = mock.return();

    const pe = new PuppeteerElement(Promise.resolve(eh));
    await pe.click();

    expect(eh.click).toHaveBeenCalledTimes(1);
  });
});
