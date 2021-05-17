import { Response } from './Response';
import { Request } from './Request';

export interface RequestProvider {
  execute: (request: Request) => Promise<Response>;
}
