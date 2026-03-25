import { render, screen } from '@testing-library/react';
import { ReactElement } from 'react';
import { Id } from '@thisisagile/easy';
import { waitForRender } from './waitForRender';
import { ElementTester } from './ElementTester';

const byIndex = (getAll: () => HTMLElement[], index: number = 0): HTMLElement => getAll()[index];

export class Tester {
  constructor(public readonly container: HTMLElement) {}

  static render = (component: ReactElement): Promise<Tester> => waitForRender(component).then(c => new Tester(c.container));
  static renderSync = (component: ReactElement): Tester => new Tester(render(component).container);

  byAlt = (alt: string, index?: number): HTMLElement => byIndex(() => screen.getAllByAltText(alt), index);
  atAlt = (alt: string, index?: number): ElementTester => new ElementTester(() => this.byAlt(alt, index));
  byId = (id: Id, index?: number): HTMLElement => byIndex(() => screen.getAllByTestId(id.toString()), index);
  atId = (id: Id, index?: number): ElementTester => new ElementTester(() => this.byId(id, index));
  byLabel = (label: string, index?: number): HTMLElement => byIndex(() => screen.getAllByLabelText(label), index);
  atLabel = (label: string, index?: number): ElementTester => new ElementTester(() => this.byLabel(label, index));
  byPlaceholder = (placeholder: string, index?: number): HTMLElement => byIndex(() => screen.getAllByPlaceholderText(placeholder), index);
  atPlaceholder = (placeholder: string, index?: number): ElementTester => new ElementTester(() => this.byPlaceholder(placeholder, index));
  byQuery = (query: string, index?: number): HTMLElement => byIndex(() => Array.from(this.container.querySelectorAll<HTMLElement>(query)), index);
  atQuery = (query: string, index?: number): ElementTester => new ElementTester(() => this.byQuery(query, index));
  byRole = (role: string, index?: number): HTMLElement => byIndex(() => screen.getAllByRole(role), index);
  atRole = (role: string, index?: number): ElementTester => new ElementTester(() => this.byRole(role, index));
  byRow = (index?: number): HTMLElement => byIndex(() => screen.getAllByRole('row'), index);
  atRow = (index?: number): ElementTester => new ElementTester(() => this.byRow(index));
  byText = (text: string, index?: number): HTMLElement => byIndex(() => screen.getAllByText(text), index);
  atText = (text: string, index?: number): ElementTester => new ElementTester(() => this.byText(text, index));
  byTitle = (title: string, index?: number): HTMLElement => byIndex(() => screen.getAllByTitle(title), index);
  atTitle = (title: string, index?: number): ElementTester => new ElementTester(() => this.byTitle(title, index));
  byValue = (value: string, index?: number): HTMLElement => byIndex(() => screen.getAllByDisplayValue(value), index);
  atValue = (value: string, index?: number): ElementTester => new ElementTester(() => this.byValue(value, index));
  get isEmpty(): boolean { return this.container.innerHTML === ''; }
  submit = (id: Id = 'btn-submit'): ElementTester => this.atId(id);
  debug = () => screen.debug();
}

export const rendersWait = async (component: ReactElement): Promise<Tester> => await Tester.render(component);
export const renders = (component: ReactElement): Tester => Tester.renderSync(component);
