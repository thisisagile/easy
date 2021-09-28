import { ElementHandle } from 'playwright';
import { TestElement } from '@thisisagile/easy-test-web';

export class PlaywrightElement implements TestElement {
  constructor(private readonly handle: Promise<ElementHandle | null>) {}

  click(): Promise<void> {
    return this.handle.then(h => h?.click());
  }

  type(text: string): Promise<void> {
    return this.handle.then(h => h?.type(text));
  }
}
