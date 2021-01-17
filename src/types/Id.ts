import { toUuid } from './Uuid';

export type Id = string | number;
export type Code = string | number;

export const toId = (): Id => toUuid();
