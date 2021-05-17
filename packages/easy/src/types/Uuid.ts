import { v4 as uuid } from 'uuid';
import { isString } from './Is';

const isValidUuid = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i);

export type Uuid = string;

export const isUuid = (id?: unknown): id is Uuid => isString(id) && isValidUuid.test(id);

export const toUuid = (): Uuid => uuid();
