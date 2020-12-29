import { AppProvider } from './AppProvider';
import { ExpressProvider } from '../express';
import { Constructor, Enum, list, List } from '../types';

export class Service extends Enum {
  constructor(readonly name: string, private app: AppProvider = new ExpressProvider(), private resources: List<Constructor> = list()) {
    super(name);
  }

  with = (...resources: Constructor[]): this => {
    this.resources.add(...resources);
    return this;
  };

  listensAt = (port: number, message = `Service ${this.name} listening on port ${port} with ${this.resources.length} resources.`): void => {
    this.resources.forEach(res => this.app.route(res));
    this.app.listen(port, message);
  };
}

export const service = (name: string): Service => new Service(name);
