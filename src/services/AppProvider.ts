import { Constructor } from '../types';

export class AppProvider {
  use = <T>(resource: Constructor<T>): this => this;
}
