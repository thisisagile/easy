import { render, screen } from '@testing-library/react';
import { ReactElement } from 'react';
import { Id } from '@thisisagile/easy';
import { waitForRender } from './waitForRender';
import { ElementTester } from './ElementTester';

export class Tester {
  constructor(public readonly container: HTMLElement) {}

  static render = (component: ReactElement): Promise<Tester> => waitForRender(component).then(c => new Tester(c.container));
  static renderSync = (component: ReactElement): Tester => new Tester(render(component).container);

  byText = (text: string, index?: number): HTMLElement => (index ? screen.getAllByText(text)[index] : screen.getByText(text));
  atText = (text: string, index?: number): ElementTester => new ElementTester(() => this.byText(text, index));
  byId = (id: Id, index?: number): HTMLElement => (index ? screen.getAllByTestId(id.toString())[index] : screen.getByTestId(id.toString()));
  atId = (id: Id, index?: number): ElementTester => new ElementTester(() => this.byId(id, index));
  byRole = (role: string, index?: number): HTMLElement => (index ? screen.getAllByRole(role)[index] : screen.getByRole(role));
  atRole = (role: string, index?: number): ElementTester => new ElementTester(() => this.byRole(role, index));
  byRow = (index?: number): HTMLElement => (index ? screen.getAllByRole('row')[index] : screen.getByRole('row'));
  atRow = (index?: number): ElementTester => new ElementTester(() => this.byRow(index));
  byTitle = (title: string, index?: number): HTMLElement => (index ? screen.getAllByTitle(title)[index] : screen.getByTitle(title));
  atTitle = (title: string, index?: number): ElementTester => new ElementTester(() => this.byTitle(title, index));
  byPlaceholder = (placeholder: string, index?: number): HTMLElement =>
    index ? screen.getAllByPlaceholderText(placeholder)[index] : screen.getByPlaceholderText(placeholder);
  atPlaceholder = (placeholder: string, index?: number): ElementTester => new ElementTester(() => this.byPlaceholder(placeholder, index));
  byQuery = (query: string, index: number = 0): HTMLElement => {
    const elements = this.container.querySelectorAll(query);
    return elements[index] as HTMLElement;
  };
  atQuery = (query: string, index?: number): ElementTester => new ElementTester(() => this.byQuery(query, index));
  submit = (id: Id = 'btn-submit'): ElementTester => this.atId(id);
  debug = () => screen.debug();
}

export const rendersWait = async (component: ReactElement): Promise<Tester> => await Tester.render(component);
export const renders = (component: ReactElement): Tester => Tester.renderSync(component);
