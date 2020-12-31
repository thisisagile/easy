import { AppProvider } from './AppProvider';
import { ExpressProvider } from '../express';
import { Constructor, Enum, list, List } from '../types';
import { Resource } from './Resource';

export class Service extends Enum {
  constructor(readonly name: string, private app: AppProvider = new ExpressProvider(), private resources: List<Resource> = list()) {
    super(name);
  }

  with = (...resources: Constructor<Resource>[]): this => {
    this.resources = list(resources).map(r => new r());
    return this;
  };

  listensAt = (port: number, message = `Service ${this.name} listening on port ${port} with ${this.resources.length} resources.`): void => {
    this.resources.forEach(r => this.app.route(r));
    this.app.listen(port, message);
  };
}

export const service = (name: string): Service => new Service(name);
