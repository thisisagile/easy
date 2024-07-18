import { mock } from '@thisisagile/easy-test';
import { Browser, ElementHandle, Page, Response } from 'playwright';
import { PlaywrightElement, PlaywrightTester } from '../src';
import { DevUseCase } from './ref/DevUseCase';

describe('PlaywrightTester', () => {
  let tester: PlaywrightTester;
  let browser: Browser;
  let page: Page;
  const uc = DevUseCase.ReleaseCode;
  const host = 'http://localhost:8080';
  const testUrl = 'http://localhost/shops';

  beforeEach(() => {
    browser = mock.empty<Browser>();
    page = mock.empty<Page>();
    tester = new PlaywrightTester(host, browser, page);
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

    const result = tester.byDataTestId('dateTestIdValue');

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

  test('redirect resolves ok response', async () => {
    const r = mock.empty<Response>();
    r.ok = mock.return(true);

    page.goto = mock.resolve(r);

    await expect(tester.redirect(testUrl)).resolves.toBeTruthy();
    expect(page.goto).toHaveBeenCalledWith(testUrl);
  });

  test('redirect resolves not ok response', async () => {
    const r = mock.empty<Response>();
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
    expect(page.goto).toHaveBeenCalledWith('http://localhost:8080/main/release-code');
  });

  test('goto with id resolves ok response', async () => {
    const r = mock.empty<Response>();
    r.ok = mock.return(true);

    page.goto = mock.resolve(r);

    await expect(tester.goto(uc, 1)).resolves.toBeTruthy();
    expect(page.goto).toHaveBeenCalledWith('http://localhost:8080/main/release-code/1');
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

  test('host', () => {
    expect(tester.host).toBe(host);
  });
});
