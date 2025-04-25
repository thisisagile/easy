import { fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { isDefined, tryTo } from '@thisisagile/easy';
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

  click = (): this | undefined => (this.element() && fireEvent.click(this.element()) ? this : undefined);
  awaitClick = (): Promise<boolean> => waitFor(() => fireEvent.click(this.element()));
  keyDown = (key: string): this | undefined => (this.element() && fireEvent.keyDown(this.element(), { key }) ? this : undefined);
  mouseDown = (index?: number): this | undefined =>
    this.element() && fireEvent.mouseDown(isDefined(index) ? this.element().children[index] : this.element()) ? this : undefined;
  pressEnter = (): this | undefined => this.keyDown('Enter');
  type = (value: string): boolean => fireEvent.change(this.element(), { target: { value } });
  wait = (): Promise<Element> => waitFor(this.element);
  waitForRemove = (): Promise<void> => waitForElementToBeRemoved(this.element);
}
