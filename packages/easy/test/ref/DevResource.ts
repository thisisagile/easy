import {
  ContentType,
  del,
  get,
  HttpStatus,
  isDefined,
  List,
  patch,
  post,
  put,
  Req,
  requires,
  Resource,
  route,
  Scope,
  search,
  stream,
  toList,
  UseCase,
} from '../../src';
import { DevUri } from './DevUri';
import { Dev } from './Dev';

@route(DevUri.Developers)
export class DevsResource implements Resource {
  @search({ onOk: HttpStatus.NoContent })
  all = (req: Req): List<Dev> => toList(new Dev(req.id));

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
  @requires.token()
  upsert = (req: Req): Dev => new Dev(req.id);

  @del({ onOk: HttpStatus.BadGateway, type: ContentType.Stream })
  delete = (req: Req): boolean => isDefined(req.id);

  @stream()
  pdf = (): unknown => '';
}
