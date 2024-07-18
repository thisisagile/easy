import { convert, Database, DefaultProvider } from '@thisisagile/easy';
import { Collection } from '../../src';

export class DevDatabase extends Database {
  static readonly DevDB = new Database('DevDB', DefaultProvider, { cluster: 'dev' });
}

export class DevCollection extends Collection {
  get db(): Database {
    return DevDatabase.DevDB;
  }

  readonly id = this.map.field('Id', { dflt: 42 });
  readonly name = this.map.field('Name');
  readonly language = this.map.field('Language', { dflt: 'TypeScript' });
  readonly level = this.map.field('CodingLevel', { dflt: 3, convert: convert.toNumber.fromString });
}

export const devData = {
  sander: { Name: 'Sander', CodingLevel: '3' },
  jeroen: { Id: 54, Name: 'Jeroen', CodingLevel: '3' },
  wouter: { Id: 55, Name: 'Wouter', CodingLevel: '3', Language: 'C++' },
  naoufal: { Id: 56, Name: 'Naoufal', CodingLevel: '4', Language: 'Java' },
};

export const collData = {
  sander: { id: 42, name: 'Sander', level: 3, language: 'TypeScript' },
  jeroen: { id: 54, name: 'Jeroen', level: 3, language: 'TypeScript' },
  wouter: { id: 55, name: 'Wouter', level: 3, language: 'C++' },
  naoufal: { id: 56, name: 'Naoufal', level: 4, language: 'Java' },
};
