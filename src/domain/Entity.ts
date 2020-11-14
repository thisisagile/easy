import { Record } from './Record';
import { Id } from '../types';
import { required } from '../validation';

export abstract class Entity extends Record {
  @required() readonly id: Id = this.state.id;
}

export const isEntity = (e?: unknown): e is Entity => e instanceof Entity;
