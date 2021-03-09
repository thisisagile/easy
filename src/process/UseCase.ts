import { Enum, text, Text } from '../types';
import { Scope } from './Scope';

export class UseCase extends Enum {
  constructor(readonly scope: Scope, name: string, id: Text = text(name).kebab) {
    super(name, id.toString());
  }

  static readonly Main = new UseCase(Scope.Basic, 'Main');
  static readonly Login = new UseCase(Scope.Auth, 'Login');
  static readonly Logout = new UseCase(Scope.Auth, 'Logout');
  static readonly ForgotPassword = new UseCase(Scope.Auth, 'Forgot password');
  static readonly ChangePassword = new UseCase(Scope.Auth, 'Change password');
}
