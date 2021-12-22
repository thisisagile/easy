import { ElementHandle } from 'puppeteer';
import { TestElement } from '@thisisagile/easy-test-web';
import { isNotEmpty, Json } from "@thisisagile/easy";

export class PuppeteerElement implements TestElement {
  constructor(private readonly handle: Promise<ElementHandle | null>) {}

  click(): Promise<void> {
    return this.handle.then(h => h?.click());
  }

  type(text: string): Promise<void> {
    return this.handle.then(h => h?.type(text));
  }

  property(property: string): Promise<Json | undefined> {
    return this.handle.then(h => h?.getProperty(property).then(p => p.jsonValue()));
  }

  exists(): Promise<boolean> {
    return this.handle.then(h => isNotEmpty(h));
  }
}
