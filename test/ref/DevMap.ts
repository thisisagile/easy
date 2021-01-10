import { convert, Map } from '../../src';

export class DevMap extends Map {
  readonly id = this.col('Id', { def: 42 });
  readonly name = this.col('Name');
  readonly level = this.col('CodingLevel', { def: 3, convert: convert.toNumber.fromString });
}

export class TesterMap extends DevMap {
  readonly framework = this.col('Framework', { def: 'Jest' });
}

export const devData = {
  withoutId: { Name: 'Sander', CodingLevel: '3' },
  jeroen: { Id: 54, Name: 'Jeroen', CodingLevel: '3' },
  wouter: { Id: 55, Name: 'Wouter', CodingLevel: '3', ModelingLevel: '4' },
  naoufal: { Id: 56, Name: 'Naoufal', ModelingLevel: '4' },
};
