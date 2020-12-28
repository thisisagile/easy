import { meta } from '../types';
import { Scope, UseCase } from '../process';

export const requires = {

  token: (): PropertyDecorator => (subject: unknown, property: string): void => {
    meta(subject).property(property).set('token', true);
  },

  scope: (scope: Scope): PropertyDecorator => (subject: unknown, property: string): void => {
    meta(subject).property(property).set('scope', scope);
  },

  useCase: (uc: UseCase): PropertyDecorator => (subject: unknown, property: string): void => {
    meta(subject).property(property).set('uc', uc);
  },
};
