import { asString, HttpStatus, isDefined, List, meta, Req, toList } from '@thisisagile/easy';
import { DevUri } from './DevUri';
import { Dev } from './Dev';
import { RequestHandler } from 'express';
import { DevScope, DevUseCase } from '@thisisagile/easy/test/ref/DevUseCase';
import { del, get, patch, post, put, requires, Resource, route, search, stream } from '@thisisagile/easy-service';

const log =
  (): ClassDecorator =>
  (subject: unknown): void => {
    const middleware = meta(subject).get<RequestHandler[]>('middleware') ?? [];
    middleware.push((req, res, next) => {
      console.log('Logging');
      next();
    });
    meta(subject).set('middleware', middleware);
  };

const profile =
  (): PropertyDecorator =>
  (subject: unknown, property: string | symbol): void => {
    const middleware = meta(subject).property(property).get<RequestHandler[]>('middleware') ?? [];
    middleware.push((req, res, next) => {
      const start = Date.now();
      next();
      console.log(`${asString(property)} took ${Date.now() - start}ms`);
    });
    meta(subject).property(property).set('middleware', middleware);
  };

@route(DevUri.Developers)
@log()
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
  @profile()
  byId = (req: Req): Dev => new Dev(req.id);

  @put()
  @requires.useCase(DevUseCase.WriteCode)
  update = (req: Req): Dev => new Dev(req.id);

  @patch()
  @requires.token()
  upsert = (req: Req): Dev => new Dev(req.id);

  @post()
  post = (req: Req): boolean => isDefined(req.id);

  @del()
  @requires.labCoat()
  delete = (req: Req): boolean => isDefined(req.id);

  @stream()
  pdf = (): unknown => '';
}
