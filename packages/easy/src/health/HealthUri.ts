import { EasyUri, uri } from '../types/Uri';

export class HealthUri extends EasyUri {
  static readonly health = uri.segment('health');
  static readonly Health = new HealthUri([HealthUri.health]);
}
