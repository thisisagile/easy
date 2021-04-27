import { convert, Mapper } from '../../src';

export class DevMap extends Mapper {
  readonly id = this.map.item('Id', { dflt: 42 });
  readonly name = this.map.item('Name');
  readonly level = this.map.item('CodingLevel', { dflt: 3, convert: convert.toNumber.fromString });
}

export class TesterMap extends DevMap {
  readonly framework = this.map.item('Framework', { dflt: 'Jest' });
}

export const devData = {
  withoutId: { Name: 'Sander', CodingLevel: '3' },
  jeroen: { Id: 54, Name: 'Jeroen', CodingLevel: '3' },
  wouter: { Id: 55, Name: 'Wouter', CodingLevel: '3', ModelingLevel: '4' },
  naoufal: { Id: 56, Name: 'Naoufal', ModelingLevel: '4' },
};
