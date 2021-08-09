import { TestElement } from './TestElement';
import { asString, Id, text, UseCase } from '@thisisagile/easy';

export interface Tester {
  url: string;

  by(key: string, value: string): TestElement;

  byClass(c: string): TestElement;

  byId(id: string): TestElement;

  byDataTestId(Id: string): TestElement;

  byName(name: string): TestElement;

  row(contains: string): TestElement;

  submit(): TestElement;

  wait(): Promise<boolean>;

  close(): Promise<void>;

  redirect(url: string): Promise<boolean>;

  goto(to: UseCase, id?: Id): Promise<boolean>;
}

const toDomainWithPort = (host?: string, port?: number): string =>
  text(`${text(asString(host))}${port ? ':' + port.toString() : ''}`).toString();

export const toUrl = (uc: UseCase, host?: string, port?: number, id?: Id): string =>
  text(`${toDomainWithPort(host, port)}/${uc.app.name}/${uc.name}${id ? `/${id}` : ''}`).kebab.toString();
