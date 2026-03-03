import { ContentType, HttpStatus, isDefined, List, Req, toList } from '@thisisagile/easy';
import { Resource, route, requires, search, post, get, put, patch, del, stream } from '../../src';
import { DevUri } from './DevUri';
import { DevScope, DevUseCase } from '@thisisagile/easy/test/ref/DevUseCase';
import { Dev } from '@thisisagile/easy/test/ref';

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
