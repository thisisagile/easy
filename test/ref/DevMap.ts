import { convert, Map } from '../../src';

export class DevMap extends Map {
  readonly id = this.prop('Id', { def: 42 });
  readonly name = this.prop('Name');
  readonly level = this.prop('CodingLevel', { def: 3, convert: convert.toNumber.fromString });
}

export class TesterMap extends DevMap {
  readonly framework = this.prop('Framework', { def: 'Jest' });
}

export const devData = {
  withoutId: { Name: 'Sander', CodingLevel: '3' },
  jeroen: { Id: 54, Name: 'Jeroen', CodingLevel: '3' },
  wouter: { Id: 55, Name: 'Wouter', CodingLevel: '3', ModelingLevel: '4' },
  naoufal: { Id: 56, Name: 'Naoufal', ModelingLevel: '4' },
};
