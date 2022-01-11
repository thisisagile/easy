import { fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { tryTo } from '@thisisagile/easy';
import { Tester } from './Tester';

export class ElementTester {
  constructor(readonly element: () => Element) {}

  get value(): string {
    return (this.element() as any)?.value as string;
  }

  get isValid(): boolean {
    return tryTo(() => this.element())
      .is.defined()
      .map(() => true)
      .or(false);
  }

  get then(): Tester {
    return new Tester(this.element() as HTMLElement);
  }

  click = (): this | undefined => (this.element() && fireEvent.click(this.element())) ? this : undefined;
  type = (value: string): boolean => fireEvent.change(this.element(), { target: { value } });
  wait = (): Promise<Element> => waitFor(this.element);
  waitForRemove = (): Promise<void> => waitForElementToBeRemoved(this.element);
}

