import { meta } from '../types/Meta';
import { Scope } from '../process/Scope';
import { UseCase } from '../process/UseCase';

export class Requires {
  readonly labCoat =
    (): PropertyDecorator =>
    (subject: unknown, property: string | symbol): void => {
      meta(subject).property(property).set('labCoat', true);
    };

  readonly token =
    (): PropertyDecorator =>
    (subject: unknown, property: string | symbol): void => {
      meta(subject).property(property).set('token', true);
    };

  readonly scope =
    (scope: Scope): PropertyDecorator =>
    (subject: unknown, property: string | symbol): void => {
      meta(subject).property(property).set('token', true);
      meta(subject).property(property).set('scope', scope);
    };

  readonly useCase =
    (uc: UseCase): PropertyDecorator =>
    (subject: unknown, property: string | symbol): void => {
      meta(subject).property(property).set('token', true);
      meta(subject).property(property).set('uc', uc);
    };
}

export const requires = new Requires();
