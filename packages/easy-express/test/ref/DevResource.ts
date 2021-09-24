import {
  asString,
  ContentType,
  del,
  get,
  HttpStatus,
  isDefined,
  List,
  meta,
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
} from '@thisisagile/easy';
import { DevUri } from './DevUri';
import { Dev } from './Dev';
import { RequestHandler } from 'express';

const log =
  (): ClassDecorator =>
  (subject: unknown): void => {
    const middleware = meta(subject).get<RequestHandler[]>('middleware') ?? [];
    middleware.push((req, res, next) => {
      console.log("Logging");
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
  @requires.scope(Scope.Basic)
  @profile()
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
