import { Enum, text } from '../types';
import { Scope } from './Scope';
import { App } from './App';

export interface Uc {
  app: App;
  name: string;
  scopes?: Scope[];
  id?: string;
}

export class UseCase extends Enum {
  constructor(readonly app: App, name: string, id: string = text(name).kebab.toString(), readonly scopes: Scope[] = [Scope.Basic]) {
    super(name, id);
  }

  static Of(config: Uc): UseCase {
    return new UseCase(config.app, config.name, config.id, config.scopes);
  }
  //@deprecated Use app instead
  get scope(): Scope {
    return this.app;
  }

  static readonly Main = new UseCase(App.Main, 'Main');
  static readonly Login = UseCase.Of({ app: App.Main, name: 'Login', scopes: [Scope.Auth] });
  static readonly Logout = UseCase.Of({ app: App.Main, name: 'Logout', scopes: [Scope.Auth] });
  static readonly ForgotPassword = UseCase.Of({ app: App.Main, name: 'Forgot password', scopes: [Scope.Auth] });
  static readonly ChangePassword = UseCase.Of({ app: App.Main, name: 'Change password', scopes: [Scope.Auth] });
}
