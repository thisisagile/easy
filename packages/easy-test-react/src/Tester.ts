import { getByPlaceholderText, getByRole, getByTestId, getByText, render } from '@testing-library/react';
import { ReactElement } from 'react';
import { Id } from '@thisisagile/easy';
import { waitForRender } from './waitForRender';
import { ElementTester } from './ElementTester';

export class Tester {
  constructor(public readonly container: HTMLElement) {}

  static render = (component: ReactElement): Promise<Tester> => waitForRender(component).then(c => new Tester(c.container));
  static renderSync = (component: ReactElement): Tester => new Tester(render(component).container);

  byText = (text: string): HTMLElement => getByText(this.container, text);
  atText = (text: string): ElementTester => new ElementTester(() => this.byText(text));
  byId = (id: Id): HTMLElement => getByTestId(this.container, id.toString());
  atId = (id: Id): ElementTester => new ElementTester(() => this.byId(id));
  byRole = (role: string): HTMLElement => getByRole(this.container, role);
  atRole = (role: string): ElementTester => new ElementTester(() => this.byRole(role));
  byPlaceholder = (placeholder: string): HTMLElement => getByPlaceholderText(this.container, placeholder);
  atPlaceholder = (placeholder: string): ElementTester => new ElementTester(() => this.byPlaceholder(placeholder));
  submit = (id: Id = 'btn-submit'): ElementTester => this.atId(id);
}

export const rendersWait = async (component: ReactElement): Promise<Tester> => await Tester.render(component);
export const renders = (component: ReactElement): Tester => Tester.renderSync(component);
