import { App, Scope, UseCase } from '@thisisagile/easy';

export class DevScope extends Scope {
  static readonly Dev = new Scope('Dev');
  static readonly Tester = new Scope('Tester', 'test');
}

export class DevUseCase extends UseCase {
  static readonly WriteCode = new UseCase(App.Main, 'Write Code').with(DevScope.Dev);
  static readonly ReleaseCode = new UseCase(App.Main, 'Release Code').with(DevScope.Dev, DevScope.Tester);
}
