import { convert, Map, col } from '../../src';

export class DevMap extends Map {
  readonly id = col('Id', { default: 42 });
  readonly name = col('Name');
  readonly level = col('CodingLevel', { default: 3, converter: convert.toNumber.fromString });
}

export class TesterMap extends DevMap {
  readonly framework = col('Framework', { default: 'Jest' });
}

export const devData = {
  withoutId: { Name: 'Sander', CodingLevel: '3' },
  jeroen: { Id: 54, Name: 'Jeroen', CodingLevel: '3' },
  wouter: { Id: 55, Name: 'Wouter', CodingLevel: '3', ModelingLevel: '4' },
  naoufal: { Id: 56, Name: 'Naoufal', ModelingLevel: '4' },
};
