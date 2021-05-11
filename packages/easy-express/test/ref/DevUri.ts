import { EasyUri, uri } from '@thisisagile/easy';

export class DevUri extends EasyUri {
  static readonly devs = uri.segment('developers');
  static readonly language = uri.query('language');
  static readonly level = uri.query('level');

  static get Developers(): DevUri {
    return new DevUri([DevUri.devs]);
  }
  static get Developer(): DevUri {
    return new DevUri([DevUri.devs, DevUri.id, DevUri.level]);
  }

  language = (f: string): this => this.set(DevUri.language, f);
  level = (l: number): this => this.set(DevUri.level, l);
}
