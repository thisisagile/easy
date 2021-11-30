import playwright, { Browser, chromium, firefox, Page, webkit } from 'playwright';
import { PlaywrightElement } from './PlaywrightElement';
import { ctx, Id, UseCase } from '@thisisagile/easy';
import { TestElement, Tester, toUrl } from '@thisisagile/easy-test-web';

export type BrowserType = 'Chromium' | 'Webkit' | 'Firefox';

export class PlaywrightTester implements Tester {
  constructor(public host: string, private readonly browser: Browser, private readonly page: Page) {
  }

  get url(): string {
    return this.page.url();
  }

  /* istanbul ignore next */
  static launch = (browserType: BrowserType, headless: boolean): Promise<Browser> => {
    const options: playwright.LaunchOptions = {
      headless: headless,
      args: ['--no-sandbox', '--start-maximized'],
    };
    switch (browserType) {
      case 'Firefox':
        return firefox.launch(options);
      case 'Webkit':
        return webkit.launch(options);
      default:
        return chromium.launch(options);
    }
  };


  static async init(host: string = ctx.env.get('webHost', '') as string, browserType: BrowserType, headless = true, width = 1200, height = 800): Promise<Tester> {
    const browser = await PlaywrightTester.launch(browserType, headless);
    const page = await browser.newPage();
    await page.setViewportSize({ width, height });
    return new PlaywrightTester(host, browser, page);
  }

  byClass(c: string): TestElement {
    const h = this.page.waitForSelector(`.${c}`);
    return new PlaywrightElement(h);
  }

  byId(id: string): TestElement {
    const h = this.page.waitForSelector(`#${id}`);
    return new PlaywrightElement(h);
  }

  byDataTestId(id: string): TestElement {
    return this.by('data-testid', id);
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

  redirect(url: string): Promise<boolean> {
    return this.page.goto(url).then(r => r?.ok() ?? false);
  }

  goto(to: UseCase, id?: Id): Promise<boolean> {
    return this.redirect(toUrl(to, this.host, id));
  }

  wait(): Promise<boolean> {
    return this.page.waitForNavigation().then(r => r?.ok() || false);
  }

  close(): Promise<void> {
    return this.browser.close();
  }

  private byXPath(q: string): TestElement {
    const h = this.page.waitForSelector(`${q}`);
    return new PlaywrightElement(h);
  }
}
