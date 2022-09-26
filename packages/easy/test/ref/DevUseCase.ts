import { App, Scope, UseCase } from '../../src';

export class DevScope extends Scope {
  static readonly Dev = new Scope('Dev');
  static readonly Tester = new Scope('Tester', 'test');
  static readonly Manager = new Scope('Manager', 'mngr');
}

export class DevUseCase extends UseCase {
  static readonly WriteCode = new UseCase(App.Main, 'Write Code').with(DevScope.Dev);
  static readonly ReviewCode = new UseCase(App.Main, 'Review Code', 'Review').with(DevScope.Dev);
  static readonly WriteUnitTest = new UseCase(App.Main, 'Write Unit Test').with(DevScope.Dev, DevScope.Tester);
  static readonly BuildCode = new UseCase(App.Main, 'Build Code').with(DevScope.Dev, DevScope.Tester);
  static readonly ReleaseCode = new UseCase(App.Main, 'Release Code').with(DevScope.Dev, DevScope.Tester);
  static readonly CreateSpreadSheet = new UseCase(App.Main, 'Create Spread Sheet').with(DevScope.Manager);
}
