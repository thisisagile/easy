import { isIn } from './Is';

export type Primitive = string | number | bigint | boolean | symbol | null | undefined;

export const isPrimitive = (v?: unknown): v is Primitive => {
  return v === null || v === undefined || isIn(typeof v, ['string', 'number', 'bigint', 'boolean', 'symbol']);
};
