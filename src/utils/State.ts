import { Construct, ofConstruct } from '../types';

export class State {
  constructor(protected readonly state: any = {}) {}

  protected get = <T>(key: string, alt?: Construct<T>): T => this.state[key] ?? (this.state[key] = ofConstruct(alt));
  protected set = <T>(key: string, value: Construct<T>): T => this.get(key, value);
}
