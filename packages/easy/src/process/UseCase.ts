import { Enum, isIn, List, text, toList } from '../types';
import { Scope } from './Scope';
import { App } from './App';

export class UseCase extends Enum {
  constructor(readonly app: App, name: string, id: string = text(name).kebab.toString(), readonly scopes: List<Scope> = toList<Scope>()) {
    super(name, id);
  }

  //@deprecated Use app instead
  get scope(): Scope {
    return this.app;
  }
  with = (...s: Scope[]): this => {
    this.scopes.add(...s);
    return this;
  };

  static readonly byScopes = (...s: Scope[]): List<UseCase> => UseCase.filter(u => u.scopes.some(us => isIn(us, s)));

  static readonly Main = new UseCase(App.Main, 'Main');
  static readonly Login = new UseCase(App.Main, 'Login').with(Scope.Basic, Scope.Auth);
  static readonly Logout = new UseCase(App.Main, 'Logout').with(Scope.Basic, Scope.Auth);
  static readonly ForgotPassword = new UseCase(App.Main, 'Forgot password').with(Scope.Basic, Scope.Auth);
  static readonly ChangePassword = new UseCase(App.Main, 'Change password').with(Scope.Basic, Scope.Auth);
}
