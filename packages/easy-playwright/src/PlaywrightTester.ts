import playwright, { Browser, chromium, firefox, Page, webkit } from 'playwright';
import { PlaywrightElement } from './PlaywrightElement';
import { ctx, Json } from '@thisisagile/easy';
import { ClosableBrowserTester, TestElement, Tester } from '@thisisagile/easy-test-web';

export type BrowserType = 'Chromium' | 'Webkit' | 'Firefox';

export class PlaywrightTester extends ClosableBrowserTester<Page> implements Tester {
  get url(): string {
    return this.page.url();
  }

  /* istanbul ignore next */
  static launch = (browserType: BrowserType, headless: boolean, launchProps: Json): Promise<Browser> => {
    const options: playwright.LaunchOptions = {
      headless: headless,
      args: ['--no-sandbox', '--start-maximized'],
      ...launchProps,
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

  /* istanbul ignore next */
  static async init(
    browserType: BrowserType,
    host: string = ctx.env.get('webHost', '') as string,
    headless = true,
    width = 1200,
    height = 800,
    launchProps = {}
  ): Promise<Tester> {
    const browser = await PlaywrightTester.launch(browserType, headless, launchProps);
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

  private byXPath(q: string): TestElement {
    const h = this.page.waitForSelector(`${q}`);
    return new PlaywrightElement(h);
  }
}
