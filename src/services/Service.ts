import { AppProvider, Handler } from './AppProvider';
import { ExpressProvider } from '../express';
import { Constructor, Enum, list, List } from '../types';
import { Resource } from './Resource';

export class Service extends Enum {
  constructor(readonly name: string, protected app: AppProvider = new ExpressProvider(), protected resources: List<Resource> = list()) {
    super(name);
  }

  pre = (): Handler[] => [];
  post = (): Handler[] => [];

  with = (...resources: Constructor<Resource>[]): this => {
    this.resources.add(resources.map(r => new r()));
    return this;
  };

  listensAt = (port = 8080, message = `Service ${this.name} listening on port ${port} with ${this.resources.length} resources.`): void => {
    this.pre().forEach(h => this.app.use(h));
    this.resources.forEach(r => this.app.route(r));
    this.post().forEach(h => this.app.use(h));
    this.app.listen(port, message);
  };
}

export const service = (name: string): Service => new Service(name);
