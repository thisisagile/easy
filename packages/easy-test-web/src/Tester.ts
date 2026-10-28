import type { Enum as UseCase } from '@thisisagile/easy/UseCase';
import { TestElement } from './TestElement';
import { Id, text, tryTo } from '@thisisagile/easy';

export interface Tester {
  host: string;

  url: string;

  by(key: string, value: string): TestElement;

  byClass(c: string): TestElement;

  byId(id: string): TestElement;

  byDataTestId(id: string): TestElement;

  byName(name: string): TestElement;

  row(contains: string): TestElement;

  submit(): TestElement;

  wait(): Promise<boolean>;

  close(): Promise<void>;

  redirect(url: string): Promise<boolean>;

  goto(to: UseCase, id?: Id): Promise<boolean>;
}

export const toUrl = (uc: UseCase, host?: string, id?: Id): string =>
  tryTo(() => host)
    .map(domain => ({ domain, i: id ? `/${id}` : '' }))
    .map(({ domain, i }) => text(`${domain}/${uc.app}/${uc}${i}`))
    .map(url => url.kebab.toString()).value;

type NavigationResponse = { ok(): boolean };
export type Navigation = {
  goto(url: string): Promise<NavigationResponse | null>;
  waitForNavigation(): Promise<NavigationResponse | null>;
};

export const redirect = (navigation: Navigation, url: string): Promise<boolean> => navigation.goto(url).then(response => response?.ok() ?? false);

export const waitForNavigation = (navigation: Navigation): Promise<boolean> => navigation.waitForNavigation().then(response => response?.ok() || false);

export abstract class BrowserTester<Page extends Navigation> {
  protected constructor(
    public host: string,
    protected readonly page: Page
  ) {}

  redirect(url: string): Promise<boolean> {
    return redirect(this.page, url);
  }

  goto(to: UseCase, id?: Id): Promise<boolean> {
    return this.redirect(toUrl(to, this.host, id));
  }

  wait(): Promise<boolean> {
    return waitForNavigation(this.page);
  }
}

type ClosableBrowser = { close(): Promise<void> };

export abstract class ClosableBrowserTester<Page extends Navigation> extends BrowserTester<Page> {
  constructor(
    host: string,
    protected readonly browser: ClosableBrowser,
    page: Page
  ) {
    super(host, page);
  }

  close(): Promise<void> {
    return this.browser.close();
  }
}
