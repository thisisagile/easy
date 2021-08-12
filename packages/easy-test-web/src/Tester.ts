import { TestElement } from './TestElement';
import { asString, EnvContext, Id, text, UseCase } from '@thisisagile/easy';

export interface Tester {
  env: EnvContext;

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


export const toUrl = (uc: UseCase, host?: string, port?: number, id?: Id): string => {
  const p = port ? `:${port}` : '';
  const domain = `${asString(host)}${p}`;
  const i = id ? `/${id}` : '';
  return text(`${domain}/${uc.app.name}/${uc.name}${i}`).kebab.toString();
};

