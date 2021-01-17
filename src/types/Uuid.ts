import { v4 as uuid } from 'uuid';
import { isString } from './Is';

const regex = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

export type Uuid = string;

export const isUuid = (id?: unknown): id is Uuid => isString(id) && regex.test(id);

export const toUuid = (): Uuid => uuid();
