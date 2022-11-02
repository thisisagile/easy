import {render, screen} from '@testing-library/react';
import {ReactElement} from 'react';
import {Id} from '@thisisagile/easy';
import {waitForRender} from './waitForRender';
import {ElementTester} from './ElementTester';

export class Tester {
    constructor(public readonly container: HTMLElement) {
    }

    static render = (component: ReactElement): Promise<Tester> => waitForRender(component).then(c => new Tester(c.container));
    static renderSync = (component: ReactElement): Tester => new Tester(render(component).container);

    byText = (text: string, index?: number): HTMLElement => index ? screen.getAllByText(text)[0] : screen.getByText(text);
    atText = (text: string): ElementTester => new ElementTester(() => this.byText(text));
    byId = (id: Id): HTMLElement => screen.getByTestId(id.toString());
    atId = (id: Id): ElementTester => new ElementTester(() => this.byId(id));
    byRole = (role: string): HTMLElement => screen.getByRole(role);
    atRole = (role: string): ElementTester => new ElementTester(() => this.byRole(role));
    byTitle = (title: string): HTMLElement => screen.getByTitle(title);
    atTitle = (title: string): ElementTester => new ElementTester(() => this.byTitle(title));
    byPlaceholder = (placeholder: string): HTMLElement => screen.getByPlaceholderText(placeholder);
    atPlaceholder = (placeholder: string): ElementTester => new ElementTester(() => this.byPlaceholder(placeholder));
    submit = (id: Id = 'btn-submit'): ElementTester => this.atId(id);
}

export const rendersWait = async (component: ReactElement): Promise<Tester> => await Tester.render(component);
export const renders = (component: ReactElement): Tester => Tester.renderSync(component);
