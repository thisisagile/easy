import { Enum } from '../../src';

export class Language extends Enum {
  static readonly Java = new Language('Java');
  static readonly JavaScript = new Language('JavaScript', 'javascript', 'js');
  static readonly TypeScript = new Language('TypeScript', 'typescript', 'ts');
}
