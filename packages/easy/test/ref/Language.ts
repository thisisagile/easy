import { Enum, Id, registry } from '../../src';

export class LanguageValue extends Enum {
  constructor(name: string, id: Id = name.toLowerCase(), code: string = id.toString()) {
    super(name, id, code);
  }
}

const Cobol = new LanguageValue('COBOL');
const Java = new LanguageValue('Java');
const JavaScript = new LanguageValue('JavaScript', 'javascript', 'js');
const TypeScript = new LanguageValue('TypeScript', 'typescript', 'ts');
const languages = registry({ Cobol, Java, JavaScript, TypeScript });

export const Language = { Cobol, Java, JavaScript, TypeScript, ...languages };
