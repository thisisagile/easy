import { v4 as uuid } from 'uuid';
import { isString } from './Is';
import { asString } from './Text';

export type Uuid = string;
export const toUuid = (): Uuid => uuid();

const isValidUuid = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i);
export const isUuid = (id?: unknown): id is Uuid => isString(id) && isValidUuid.test(id);

const includeUuid = new RegExp(/\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/i);
export const includesUuid = (value?: unknown): boolean => includeUuid.test(asString(value));
