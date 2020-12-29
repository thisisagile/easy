import { del, get, HttpStatus, isDefined, list, List, patch, post, put, Req, requires, route, Scope, UseCase } from '../../src';
import { DevUri } from './DevUri';
import { Dev } from './Dev';

export class Resource<T> {}

@route(DevUri.Developers)
export class DevsResource {
  @get()
  @requires.token()
  all = (req: Req): List<Dev> => list(new Dev(req.id));

  @post()
  insert = (req: Req): Dev => new Dev(req.id);
}

@route(DevUri.Developer)
export class DevResource extends Resource<Dev> {
  @get(HttpStatus.Ok, HttpStatus.NoContent)
  @requires.scope(Scope.Basic)
  byId = (req: Req): Dev => new Dev(req.id);

  @put()
  @requires.useCase(UseCase.ChangePassword)
  update = (req: Req): Dev => new Dev(req.id);

  @patch()
  upsert = (req: Req): Dev => new Dev(req.id);

  @del()
  delete = (req: Req): boolean => isDefined(req.id);
}
