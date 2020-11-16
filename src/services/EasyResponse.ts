import { Json, Result } from '../types';
import { HttpStatus } from './HttpStatus';

export class EasyResponse {

  constructor(readonly content?: any) {}

  get data(): { items: Json[], itemCount: number } {
    return {
      items: this.content?.data,
      itemCount: this.content?.data.length
    }
  };

  get error(): { errors: Result[], code: HttpStatus } {
    return {
      errors: this.content?.errors,
      code: HttpStatus.BadRequest
    }
  };

}
