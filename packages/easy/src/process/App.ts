import { Scope } from './Scope';

export class App extends Scope {
  constructor(name: string, readonly port?: number) {
    super(name);
  }
}
