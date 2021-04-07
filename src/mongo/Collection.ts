import { Map, PropertyOptions } from '../utils';
import { Database } from '../data';
import { toUuid } from '../types';
import { Field } from './Field';

export class Collection extends Map<Field> {
  readonly db = Database.Main;

  prop = <T = unknown>(name: string, options?: PropertyOptions<T>): Field => new Field(this, name, options);

  readonly id = this.prop('id', { dflt: toUuid });
}
