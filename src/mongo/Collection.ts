import { Map, PropertyOptions } from '../utils';
import { Database } from '../data';
import { Json, toUuid } from '../types';
import { Field } from './Field';
import { Condition, LogicalCondition } from './Condition';

export class Collection extends Map<Field> {
  readonly db = Database.Default;

  prop = <T = unknown>(name: string, options?: PropertyOptions<T>): Field => new Field(this, name, options);

  readonly id = this.prop('id', { dflt: toUuid });

  where = (...conditions: Condition[]): Json => new LogicalCondition('and', conditions).toJSON();
}
