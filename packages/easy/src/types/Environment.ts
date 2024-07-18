import { Enum } from './Enum';

export class Environment extends Enum {
  static readonly Dev = new Environment('Development', 'dev');
  static readonly Tst = new Environment('Test', 'tst');
  static readonly Acc = new Environment('Acceptance', 'acc');
  static readonly Prd = new Environment('Production', 'prd');
}
