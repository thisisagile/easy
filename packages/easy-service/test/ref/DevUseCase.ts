import { App, Scope, UseCase } from '@thisisagile/easy';

export class DevScope extends Scope {
  static readonly Dev = new Scope('Dev');
}

export class DevUseCase extends UseCase {
  static readonly WriteCode = new UseCase(App.Main, 'Write Code').with(DevScope.Dev);
}
