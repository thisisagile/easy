import { Id } from './Id';

export type Identity = { id: Id; user?: string };

export type IdName = { id: Id; name: string, slug?: string };
