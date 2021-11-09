import { TestElement } from './TestElement';
import { asString, EnvContext, Id, text, tryTo, UseCase } from '@thisisagile/easy';

export interface Tester {
  env: EnvContext;

  url: string;

  by(key: string, value: string): TestElement;

  byClass(c: string): TestElement;

  byId(id: string): TestElement;

  byDataTestId(id: string): TestElement;

  byName(name: string): TestElement;

  row(contains: string): TestElement;

  submit(): TestElement;

  wait(): Promise<boolean>;

  close(): Promise<void>;

  redirect(url: string): Promise<boolean>;

  goto(to: UseCase, id?: Id): Promise<boolean>;
}

export const toUrl = (uc: UseCase, host?: string, port?: number, id?: Id): string =>
  tryTo(() => port ? `:${port}` : '')
    .map(p => `${asString(host)}${p}`)
    .map(domain => ({domain, i: id ? `/${id}` : ''}))
    .map(({domain, i}) => text(`${domain}/${uc.app.name}/${uc.name}${i}`))
    .map(url => url.kebab.toString()).value;

