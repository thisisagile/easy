import { ElementHandle } from 'puppeteer';
import { TestElement } from './TestElement';

export class PuppeteerElement implements TestElement {
  constructor(private readonly handle: Promise<ElementHandle | null>) {}

  click(): Promise<void> {
    return this.handle.then(h => h?.click());
  }

  type(text: string): Promise<void> {
    return this.handle.then(h => h?.type(text));
  }
}
