import { Scope } from './Scope';

export class App extends Scope {
  constructor(name: string, readonly port?: number) {
    super(name);
  }

  static readonly Main = new App('Main', 3000);
}
