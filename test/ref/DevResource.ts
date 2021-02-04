import { del, get, HttpStatus, isDefined, list, List, patch, post, put, Req, requires, Resource, route, Scope, search, UseCase } from '../../src';
import { DevUri } from './DevUri';
import { Dev } from './Dev';

@route(DevUri.Developers)
export class DevsResource implements Resource {
  @search({onOk: HttpStatus.NoContent})
  @requires.token()
  all = (req: Req): List<Dev> => list(new Dev(req.id));

  @post()
  insert = (req: Req): Dev => new Dev(req.id);
}

@route(DevUri.Developer)
export class DevResource implements Resource {
  @get()
  @requires.scope(Scope.Basic)
  byId = (req: Req): Dev => new Dev(req.id);

  @put()
  @requires.useCase(UseCase.ChangePassword)
  update = (req: Req): Dev => new Dev(req.id);

  @patch()
  upsert = (req: Req): Dev => new Dev(req.id);

  @del({ onOk: HttpStatus.BadGateway })
  delete = (req: Req): boolean => isDefined(req.id);
}
