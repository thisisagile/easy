import { Tester, toUrl } from './Tester';
import { PuppeteerElement } from './PuppeteerElement';
import puppeteer, { Browser, Page } from 'puppeteer';
import { EnvContext } from '@thisisagile/easy/src/types/Context';
import { Id, UseCase } from '@thisisagile/easy';
import { TestElement } from './TestElement';

export class PuppeteerTester implements Tester {
  constructor(public env: EnvContext, private readonly browser: Browser, private readonly page: Page) {}

  get url(): string {
    return this.page.target().url();
  }

  /* istanbul ignore next */
  static async init(env: EnvContext, headless = true): Promise<Tester> {
    const browser = await puppeteer.launch({ headless, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    return new PuppeteerTester(env, browser, page);
  }

  byClass(c: string): TestElement {
    const h = this.page.waitForSelector(`.${c}`);
    return new PuppeteerElement(h);
  }

  byId(id: string): TestElement {
    const h = this.page.waitForSelector(`#${id}`);
    return new PuppeteerElement(h);
  }

  byDateTestId(Id: string): TestElement {
    return this.by('data-testid', Id);
  }

  byName(name: string): TestElement {
    return this.by('name', name);
  }

  by(key: string, value: string): TestElement {
    const h = this.page.waitForSelector(`[${key}=${value}]`);
    return new PuppeteerElement(h);
  }

  submit(): TestElement {
    return this.by('type', 'submit');
  }

  row(contains: string): TestElement {
    // Select the first row that contains the given input
    return this.byXPath(`(//tr[contains(., '${contains}')])[1]`);
  }

  async search(text: string): Promise<void> {
    await this.byId('search').type(text);
    return this.byClass('ant-input-search-button').click();
  }

  redirect(url: string): Promise<boolean> {
    return this.page.goto(url).then(r => r?.ok() ?? false);
  }

  goto(to: UseCase, id?: Id): Promise<boolean> {
    return this.redirect(toUrl(to, this.env.host, this.env.port, id));
  }

  wait(): Promise<boolean> {
    return this.page.waitForNavigation().then(r => r?.ok() || false);
  }

  close(): Promise<void> {
    return this.browser.close();
  }

  async login(user = this.env.get('User') as string, password = this.env.get('Password') as string): Promise<boolean> {
    await this.byId('form_email').type(user);
    await this.byId('form_password').type(password);
    await this.submit().click();
    return this.wait();
  }

  private byXPath(q: string): TestElement {
    const h = this.page.waitForXPath(`${q}`);
    return new PuppeteerElement(h);
  }
}
