import { ContentType, del, get, HttpStatus, isDefined, List, patch, post, put, Req, requires, Resource, route, search, stream, toList } from '../../src';
import { DevUri } from './DevUri';
import { Dev } from './Dev';
import { DevScope, DevUseCase } from './DevUseCase';

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
  @requires.scope(DevScope.Dev)
  byId = (req: Req): Dev => new Dev(req.id);

  @put()
  @requires.useCase(DevUseCase.WriteCode)
  update = (req: Req): Dev => new Dev(req.id);

  @patch()
  @requires.token()
  upsert = (req: Req): Dev => new Dev(req.id);

  @del({ onOk: HttpStatus.BadGateway, type: ContentType.Stream })
  delete = (req: Req): boolean => isDefined(req.id);

  @stream()
  pdf = (): unknown => '';
}
