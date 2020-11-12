import { del, EasyRequest, get, HttpStatus, patch, post, put, route } from '../../src/services';
import { DevUri } from './DevUri';
import { List, list } from '../../src/utils';
import { Dev } from './Dev';

export class Resource<T> {}

@route(DevUri.Developers)
export class DevsResource {
  @get() all = (req: EasyRequest): List<Dev> => list();
  @post() insert = (req: EasyRequest): Dev => new Dev(req.id);
}

@route(DevUri.Developer)
export class DevResource extends Resource<Dev> {
  @get(HttpStatus.Ok, HttpStatus.NoContent) byId = (req: EasyRequest): Dev => new Dev(req.id);
  @put() update = (req: EasyRequest): Dev => new Dev();
  @patch() upsert = (req: EasyRequest): Dev => new Dev();
  @del() delete = (req: EasyRequest): boolean => true;
}
