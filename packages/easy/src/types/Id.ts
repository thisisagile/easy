import { toUuid } from './Uuid';

export type Id = string | number;
export type Key = Id;
export type Code = Id;
export type HasId = { id: Id };

export const toId = (): Id => toUuid();
