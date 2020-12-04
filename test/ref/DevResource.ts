import { del, EasyRequest, get, HttpStatus, isDefined, list, List, patch, post, put, route } from '../../src';
import { DevUri } from './DevUri';
import { Dev } from './Dev';

export class Resource<T> {}

@route(DevUri.Developers)
export class DevsResource {
  @get() all = (req: EasyRequest): List<Dev> => list(new Dev(req.id));
  @post() insert = (req: EasyRequest): Dev => new Dev(req.id);
}

@route(DevUri.Developer)
export class DevResource extends Resource<Dev> {
  @get(HttpStatus.Ok, HttpStatus.NoContent) byId = (req: EasyRequest): Dev => new Dev(req.id);
  @put() update = (req: EasyRequest): Dev => new Dev(req.id);
  @patch() upsert = (req: EasyRequest): Dev => new Dev(req.id);
  @del() delete = (req: EasyRequest): boolean => isDefined(req.id);
}
