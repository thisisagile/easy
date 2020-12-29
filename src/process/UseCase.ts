import { Enum } from '../types';
import { Scope } from './Scope';
import { stringify } from '../utils';

export class UseCase extends Enum {
  constructor(readonly scope: Scope, name: string, id: string = stringify(name).kebab) {
    super(name, id);
  }

  static readonly Main = new UseCase(Scope.Basic, 'Main');
  static readonly Login = new UseCase(Scope.Auth, 'Login');
  static readonly Logout = new UseCase(Scope.Auth, 'Logout');
  static readonly ForgotPassword = new UseCase(Scope.Auth, 'Forgot password');
  static readonly ChangePassword = new UseCase(Scope.Auth, 'Change password');
}
