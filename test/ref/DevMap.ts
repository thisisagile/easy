import { convert, Map } from '../../src';

export class DevMap extends Map {
  readonly id = this.col('Id', { default: 42 });
  readonly name = this.col('Name');
  readonly level = this.col('CodingLevel', { default: 3, converter: convert.toNumber.fromString });
}

export class TesterMap extends DevMap {
  readonly framework = this.col('Framework', { default: 'Jest' });
}

export const devData = {
  withoutId: { Name: 'Sander', CodingLevel: '3' },
  jeroen: { Id: 54, Name: 'Jeroen', CodingLevel: '3' },
  wouter: { Id: 55, Name: 'Wouter', CodingLevel: '3', ModelingLevel: '4' },
  naoufal: { Id: 56, Name: 'Naoufal', ModelingLevel: '4' },
};
