import { TestElement } from './TestElement';
import { Id, UseCase } from '@thisisagile/easy';

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
