import { Id } from './Id';

export type IdNamePlain = { id: Id; name: string };
export type IdName = IdNamePlain & { slug?: string };
