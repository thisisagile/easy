import { URL } from 'url';
import { EasyUri, uri } from './Uri';
import { UseCase } from '../process';
import { text } from './Text';

export class AppUri extends EasyUri {
  static readonly app = uri.path('app');
  static readonly uc = uri.path('uc');

  public host = uri.path('host');
  readonly resource = uri.segment();

  static get App(): AppUri {
    return new AppUri([AppUri.app]);
  }

  static get Uc(): AppUri {
    return new AppUri([AppUri.app, AppUri.uc]);
  }

  static get UcAndId(): AppUri {
    return new AppUri([AppUri.app, AppUri.uc, AppUri.id]);
  }

  uc = (uc: UseCase, host?: URL): this => {
    this.host = uri.host(host ? host.toString() : '');
    this.set(AppUri.app, text(uc?.app.name).kebab);
    return this.set(AppUri.uc, text(uc?.name).kebab);
  };
}
