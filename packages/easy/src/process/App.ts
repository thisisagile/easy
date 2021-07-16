import { Scope } from './Scope';

export class App extends Scope {
  constructor(name: string) {
    super(name);
  }

  static readonly Main = new App('Main');
}
