import { Tester, toUrl } from './Tester';
import { EnvContext } from '@thisisagile/easy/src/types/Context';
import playwright, { Browser, chromium, firefox, Page, webkit } from 'playwright';
import { PlaywrightElement } from './PlaywrightElement';
import { Id, UseCase } from '@thisisagile/easy';
import { TestElement } from './TestElement';

export type BrowserType = 'Chromium' | 'Webkit' | 'Firefox';

export class PlaywrightTester implements Tester {
  constructor(public env: EnvContext, private readonly browser: Browser, private readonly page: Page) {}

  get url(): string {
    return this.page.url();
  }

  /* istanbul ignore next */
  static async init(env: EnvContext, browserType: BrowserType, headless = true): Promise<Tester> {
    let browser: playwright.Browser;
    const options: playwright.LaunchOptions = { headless: headless, args: ['--no-sandbox'], slowMo: 40 };
    switch (browserType) {
      case 'Chromium':
        browser = await chromium.launch(options);
        break;
      case 'Firefox':
        browser = await firefox.launch(options);
        break;
      case 'Webkit':
        browser = await webkit.launch(options);
        break;
    }
    const page = await browser.newPage();
    return new PlaywrightTester(env, browser, page);
  }

  byClass(c: string): TestElement {
    const h = this.page.waitForSelector(`.${c}`);
    return new PlaywrightElement(h);
  }

  byId(id: string): TestElement {
    const h = this.page.waitForSelector(`#${id}`);
    return new PlaywrightElement(h);
  }

  byDateTestId(Id: string): TestElement {
    return this.by('data-testid', Id);
  }

  byName(name: string): TestElement {
    return this.by('name', name);
  }

  by(key: string, value: string): TestElement {
    const h = this.page.waitForSelector(`[${key}=${value}]`);
    return new PlaywrightElement(h);
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
    const h = this.page.waitForSelector(`${q}`);
    return new PlaywrightElement(h);
  }
}
