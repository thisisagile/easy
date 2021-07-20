import { fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react';

export class ElementTester {
  constructor(readonly element: () => Element) {}

  get value(): string {
    return (this.element() as any)?.value as string;
  }

  get isValid(): boolean {
    try {
      this.element();
      return true;
    } catch {
      return false;
    }
  }

  click = (): boolean => (this.element() ? fireEvent.click(this.element()) : false);
  type = (value: string): boolean => fireEvent.change(this.element(), { target: { value } });
  wait = (): Promise<Element> => waitFor(this.element);
  waitForRemove = (): Promise<void> => waitForElementToBeRemoved(this.element);
}
