import { TestElement } from './TestElement';
import { asString, Id, text, UseCase } from '@thisisagile/easy';

export interface Tester {
  url: string;

  by(key: string, value: string): TestElement;

  byClass(c: string): TestElement;

  byId(id: string): TestElement;

  byDateTestId(Id: string): TestElement;

  byName(name: string): TestElement;

  row(contains: string): TestElement;

  submit(): TestElement;

  wait(): Promise<boolean>;

  close(): Promise<void>;

  redirect(url: string): Promise<boolean>;

  goto(to: UseCase, id?: Id): Promise<boolean>;

  search(test: string): Promise<void>;

  login(): Promise<boolean>;
}

export const toUrl = (uc: UseCase, host?: string, port?: number, id?: Id): string =>
  text(`${text(asString(host))}${port ? ':' + port.toString() : ''}/${uc.app.name}/${uc.name}${id ? '/' + id.toString() : ''}`).kebab.toString();
