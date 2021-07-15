import { getByPlaceholderText, getByRole, getByTestId, getByText, render } from '@testing-library/react';
import { ReactElement } from 'react';
import { Id } from '@thisisagile/easy';
import { waitForRender } from './waitForRender';
import { ReactTestElement } from './ReactTestElement';

export class ReactTester {
  constructor(public readonly container: HTMLElement) {}

  static render = (component: ReactElement): Promise<ReactTester> => waitForRender(component).then(c => new ReactTester(c.container));
  static renderSync = (component: ReactElement): ReactTester => new ReactTester(render(component).container);

  byText = (text: string): HTMLElement => getByText(this.container, text);
  atText = (text: string): ReactTestElement => new ReactTestElement(() => this.byText(text));
  byId = (id: Id): HTMLElement => getByTestId(this.container, id.toString());
  atId = (id: Id): ReactTestElement => new ReactTestElement(() => this.byId(id));
  byRole = (role: string): HTMLElement => getByRole(this.container, role);
  atRole = (role: string): ReactTestElement => new ReactTestElement(() => this.byRole(role));
  byPlaceholder = (placeholder: string): HTMLElement => getByPlaceholderText(this.container, placeholder);
  atPlaceholder = (placeholder: string): ReactTestElement => new ReactTestElement(() => this.byPlaceholder(placeholder));
}

export const rendersWait = async (component: ReactElement): Promise<ReactTester> => await ReactTester.render(component);
export const renders = (component: ReactElement): ReactTester => ReactTester.renderSync(component);
