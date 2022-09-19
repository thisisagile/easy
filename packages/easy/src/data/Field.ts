import { Property } from '../utils';
import { Condition, SortCondition, toCondition } from './Condition';
import { isDefined, toArray } from '../types';

export class Field extends Property {
  is = (value: unknown): Condition => this.condition('eq', value);

  isNot = (value: unknown): Condition => this.condition('ne', value);

  isIn = (...value: unknown[]): Condition => this.condition('in', toArray(value));

  notIn = (...value: unknown[]): Condition => this.condition('nin', toArray(value));

  exists = (does: boolean): Condition => this.condition('exists', does);

  greater = (value: unknown): Condition => this.condition('gt', value);

  greaterEqual = (value: unknown): Condition => this.condition('gte', value);

  less = (value: unknown): Condition => this.condition('lt', value);

  lessEqual = (value: unknown): Condition => this.condition('lte', value);

  asc = (): SortCondition => new SortCondition(this.property, 1);

  desc = (): SortCondition => new SortCondition(this.property, -1);

  protected condition = (operator: string, value: unknown): Condition => toCondition(this.property, operator, value, this.options?.convert);
}

export const isField = (f?: unknown): f is Field => isDefined(f) && f instanceof Field;
