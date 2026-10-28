import type { Enum as Scope } from '@thisisagile/easy/Scope';
import type { Enum as UseCase } from '@thisisagile/easy/UseCase';
import { meta } from '@thisisagile/easy';

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
