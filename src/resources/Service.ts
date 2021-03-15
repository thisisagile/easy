import { AppProvider, Handler } from './AppProvider';
import { Constructor, Enum, list, List } from '../types';
import { Resource } from './Resource';

export class Service extends Enum {
  protected port = 8080;

  constructor(readonly name: string, protected app: AppProvider, protected resources: List<Resource> = list()) {
    super(name);
  }

  pre = (): Handler[] => [];
  post = (): Handler[] => [];

  with(...resources: Constructor<Resource>[]): this {
    this.resources.add(resources.map(r => new r()));
    return this;
  }

  atPort(port: number): this {
    this.port = port;
    return this;
  }

  bodyLoggerHook: (app: AppProvider)=> void = undefined;

  start(message = `Service ${this.name} listening on port ${this.port} with ${this.resources.length} resources.`): void {
    this.pre().forEach(h => this.app.use(h));
    if (this.bodyLoggerHook) {
      this.bodyLoggerHook(this.app);
    }
    this.resources.forEach(r => this.app.route(this, r));
    this.post().forEach(h => this.app.use(h));
    this.app.listen(this.port, message);
  }
}
